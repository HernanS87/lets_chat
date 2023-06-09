import { createContext, useContext, useEffect, useRef, useState } from "react";
import { db, storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL, list } from "firebase/storage";
import { v4 } from "uuid";
import { useAuthContext } from "./AuthContext";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [activeChannel, setActiveChannel] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");
  const [msgToEdit, setMsgToEdit] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [popupUser, setPopupUser] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [newChannel, setNewChannel] = useState(false);
  const [editActiveChannel, setEditActiveChannel] = useState(false);

  const [channelImage, setChannelImage] = useState(null);
  const [tempChannelImage, setTempChannelImage] = useState(null);
  const [channelNameForm, setChannelNameForm] = useState("");

  const [loadingImage, setLoadingImage] = useState(false);

  const txtAreaRef = useRef();

  const [listOfComponentsToClose, setListOfComponentsToClose] = useState([]);
  const [showEmojiPickerChannel, setShowEmojiPickerChannel] = useState(false);
  const [showEmojiPickerChat, setShowEmojiPickerChat] = useState(false);

  const closeEmojisPickerChat = () => {
    setShowEmojiPickerChat(false);
  };

  const closeEmojisPickerChannel = () => {
    setShowEmojiPickerChannel(false);
  };

  const closeImagePopup = () => {
    setFileURL(null);
  };

  const closeNewChannelForm = () => {
    setNewChannel(false);
    setChannelImage(null);
    setChannelNameForm("");
    setEditActiveChannel(false);
  };

  const closeAnyComponentWithEsc = (e) => {
    if (e.keyCode === 27) {
      console.log(
        "lista de componentes antes del pop",
        listOfComponentsToClose
      );
      let componentToClose = listOfComponentsToClose.pop();
      setListOfComponentsToClose(listOfComponentsToClose);
      console.log("lista de componentes desp del pop", listOfComponentsToClose);
      switch (componentToClose) {
        case "EmojisPickerChat":
          closeEmojisPickerChat();
          break;
        case "EmojisPickerChannel":
          closeEmojisPickerChannel();
          break;
        case "ImagePopup":
          closeImagePopup();
          break;
        case "NewChannelForm":
          closeNewChannelForm();
          break;
        default:
          console.log("No hay ningun componente para cerrar");
          break;
      }
    }
  };

  const [cancelEdit, setCancelEdit] = useState(false);
  const { user } = useAuthContext();

  const uploadFile = async (file, type) => {
    const storageRef = ref(storage, `${type}/${v4()}`);
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
          `canales/${activeChannel.id}/mensajes/${msgToEdit.id}`
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
        const msgRef = collection(db, `canales/${activeChannel.id}/mensajes`);
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
    setLoadingImage(true);
    if (!e.target.files[0].type.includes("image")) {
      e.target.value = null;
      return toast.error("Solo puedes subir imagenes!", {
        position: "top-center",
        autoClose: 2500,
      });
    }
    try {
      const result = await uploadFile(e.target.files[0], "imagenes");
      setFileURL(result);
      setLoadingImage(false);
      e.target.value = null;
    } catch (error) {
      toast.error("Ha ocurrido un error, intentalo mas tarde", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  };

  const handleChannelForm = async () => {
    if (channelNameForm) {
      if (editActiveChannel) {
        const channelRef = doc(db, `canales/${activeChannel.id}`);
        await updateDoc(channelRef, {
          ...activeChannel,
          name: channelNameForm,
          image: channelImage,
          lastUpdate: {
            userName: user.displayName,
            userId: user.uid,
            timestamp: Date.now(),
          },
        });
        toast.success(`Canal ${channelNameForm} editado correctamente!`, {
          position: "top-center",
          autoClose: 1500,
        });
        setChannelNameForm("");
        setChannelImage(null);
        setEditActiveChannel(false);
        setActiveChannel({
          ...activeChannel,
          name: channelNameForm,
          image: channelImage,
        });
      } else {
        const channelRef = collection(db, `canales`);
        await addDoc(channelRef, {
          name: channelNameForm,
          image: channelImage,
          creator: user.displayName,
          creator_id: user.uid,
          timestamp: Date.now(),
        });
        toast.success(`Canal ${channelNameForm} creado correctamente!`, {
          position: "top-center",
          autoClose: 1500,
        });
        setNewChannel(false);
        setChannelNameForm("");
        setChannelImage(null);
      }
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
        channelImage,
        setChannelImage,
        tempChannelImage,
        setTempChannelImage,
        channelNameForm,
        setChannelNameForm,
        handleChannelForm,
        editActiveChannel,
        setEditActiveChannel,
        loadingImage,
        showEmojiPickerChannel,
        setShowEmojiPickerChannel,
        showEmojiPickerChat,
        setShowEmojiPickerChat,
        listOfComponentsToClose,
        setListOfComponentsToClose,
        closeAnyComponentWithEsc,
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
