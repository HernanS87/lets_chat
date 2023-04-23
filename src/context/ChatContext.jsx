import { createContext, useContext, useEffect, useRef, useState } from "react";
import { db, storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [activeChannel, setActiveChannel] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [msgToEdit, setMsgToEdit] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [popupUser, setPopupUser] = useState(false);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [newChannel, setNewChannel] = useState(false);

  const txtAreaRef = useRef();

  const [cancelEdit, setCancelEdit] = useState(false);
  const { user } = useAuthContext();

  const changeActiveChannel = (channel) => {
    setActiveChannel(channel);
    navigate("/");
  };

  const uploadFile = async (file) => {
    const storageRef = ref(storage, `imagenes/${v4()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleMessage = async (newAudio = null) => {
    console.log("handlemMessage", txtAreaRef.current.value);
    const msgValue = txtAreaRef.current.value.trim();
    txtAreaRef.current.value = "";
    setTextAreaValue(false);
    setCancelEdit(false);
    if (msgValue || fileURL || newAudio) {
      if (msgToEdit) {
        const msgRef = doc(
          db,
          `canales/${activeChannel}/mensajes/${msgToEdit.id}`
        );
        const imgURL = fileURL;
        setFileURL("");
        await updateDoc(msgRef, {
          ...msgToEdit,
          message: JSON.stringify(msgValue),
          file: imgURL,
          edited: true,
        });
        setMsgToEdit("");
      } else {
        const msgRef = collection(db, `canales/${activeChannel}/mensajes`);
        const imgURL = fileURL;
        setFileURL("");
        await addDoc(msgRef, {
          username: user.displayName,
          uid: user.uid,
          avatar: user.photoURL,
          message: JSON.stringify(msgValue),
          file: imgURL,
          timestamp: Date.now(),
          audio: newAudio,
        });
      }
    }
  };

  const handleFileChange = async (e) => {
    setFileURL("");
    if (!e.target.files[0].type.includes("image")) {
      e.target.value = null;
      return toast.error("Solo puedes subir imagenes!", {
        position: "top-center",
        autoClose: 2500,
      });
    }
    try {
      const result = await uploadFile(e.target.files[0]);
      setFileURL(result);
      e.target.value = null;
    } catch (error) {
      toast.error("Ha ocurrido un error, intentalo mas tarde", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  };

  useEffect(() => {
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <ChatContext.Provider
      value={{
        activeChannel,
        setActiveChannel,
        changeActiveChannel,
        msgToEdit,
        setMsgToEdit,
        uploadFile,
        fileURL,
        setFileURL,
        textAreaValue,
        setTextAreaValue,
        popupUser,
        setPopupUser,
        handleMessage,
        handleFileChange,
        cancelEdit,
        setCancelEdit,
        txtAreaRef,
        darkMode,
        setDarkMode,
        newChannel,
        setNewChannel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);

  if (!context)
    throw new Error("useChatContext must be used within an ChannelProvider");

  return context;
};
