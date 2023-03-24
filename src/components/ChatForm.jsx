import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { useChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import EmojiPicker from "emoji-picker-react";
import ImagePopup from "./ImagePopup";

const ChatForm = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [textAreaScroll, setTextAreaScroll] = useState(false);
  const [cancelEdit, setCancelEdit] = useState(false);
  const { user } = useAuthContext();
  const txtAreaRef = useRef();
  const {
    activeChannel,
    msgToEdit,
    setMsgToEdit,
    changeMsgToEdit,
    uploadFile,
    fileURL,
    setFileURL,
    inputMessage,
    setInputMessage,
  } = useChatContext();

  const handleMessage = async (e) => {
    e.preventDefault();
    const msgValue = inputMessage.trim();
    setInputMessage("");
    setCancelEdit(false);
    if (msgValue || fileURL) {
      if (msgToEdit) {
        const msgRef = doc(
          db,
          `canales/${activeChannel}/mensajes/${msgToEdit.id}`
        );
        await updateDoc(msgRef, {
          ...msgToEdit,
          message: JSON.stringify(msgValue),
          edited: true,
        });
        toast.success("Mensaje editado correctamente!", {
          position: "top-center",
          autoClose: 1500,
        });
        changeMsgToEdit("");
      } else {
        const msgRef = collection(db, `canales/${activeChannel}/mensajes`);
        const imgURL = fileURL;
        setFileURL("");
        if (msgValue) {
          await addDoc(msgRef, {
            username: user.displayName,
            uid: user.uid,
            avatar: user.photoURL,
            message: JSON.stringify(msgValue),
            file: imgURL,
            timestamp: Date.now(),
          });
        }
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

  const addEmoji = (code) => {
    const emoji = String.fromCodePoint(`0x${code.unified}`);
    setInputMessage((prevInputMessage) => prevInputMessage + ` ${emoji}`);
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      setMsgToEdit("");
      setInputMessage("");
      setCancelEdit(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    if (msgToEdit) {
      setInputMessage(msgToEdit.message);
      setCancelEdit(true);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [msgToEdit]);

  // Este useEffect ajusta el tamaño del textArea
  useEffect(() => {
    if (txtAreaRef.current.scrollHeight > 40 && inputMessage) {
      txtAreaRef.current.style.height = "auto";
      txtAreaRef.current.style.height = txtAreaRef.current.scrollHeight + "px";
      if (txtAreaRef.current.scrollHeight > 128) {
        setTextAreaScroll(true);
      } else {
        setTextAreaScroll(false);
      }
    } else if (inputMessage == "") {
      txtAreaRef.current.style.height = "32px";
      setTextAreaScroll(false);
    }
  }, [inputMessage]);

  return (
    <>
      {fileURL && <ImagePopup />}
      {showPicker && (
        <div className="absolute right-10 bottom-20">
          <EmojiPicker height={350} width={300} onEmojiClick={addEmoji} />
        </div>
      )}
      <form
        id="form"
        onSubmit={handleMessage}
        className="flex items-center w-screen px-4 pb-4"
      >
        <div className="flex items-center w-full relative">
          {cancelEdit && (
            <div
              className="absolute top-neg-1 w-full bg-slate-900 text-xs text-slate-400 font-medium pl-2 py-1 rounded flex items-center cursor-pointer"
              onKeyDown={(e) => {
                console.log(e.key);
              }}
              onClick={() => {
                setMsgToEdit("");
                setInputMessage("");
                setCancelEdit(false);
              }}
            >
              <MdCancel size={15} className="mr-1" />
              Editando mensaje
            </div>
          )}

          <textarea
            type="text"
            ref={txtAreaRef}
            placeholder={`Escribe un mensaje en ${activeChannel} 😀`}
            rows={1}
            className={`h-8 max-h-32 resize-none   dark:bg-slate-700 p-1 pl-9 outline-none dark:text-white  dark:placeholder:text-slate-400 bg-slate-300 flex-1 w-full rounded-md placeholder:text-xs md:placeholder:text-sm xl:placeholder:text-lg placeholder:text-slate-800 placeholder:font-medium ${
              !inputMessage && "py-2 leading-4"
            } ${
              textAreaScroll
                ? "scrollbar-thin scrollbar-thumb-cyan-500 hover:scrollbar-thumb-cyan-300"
                : "overflow-y-hidden"
            }`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.target.style.height = "32px";
                handleMessage(e);
              }
            }}
          />

          <label
            htmlFor="images"
            className="bg-gray-500  rounded-full absolute left-1 cursor-pointer text-2xl font-bold px-1 h-6 leading-5 "
          >
            +
            <input
              type="file"
              className="hidden"
              id="images"
              name="images"
              // multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <MdOutlineEmojiEmotions
          className="cursor-pointer mx-1"
          size={30}
          onClick={() => setShowPicker(!showPicker)}
        />

        <button type="submit" className="bg-cyan-500 rounded-lg px-2 py-1">
          <RiSendPlaneFill
            size={30}
            color={"#fff"}
            className="cursor-pointer"
          />
        </button>
      </form>
    </>
  );
};

export default ChatForm;
