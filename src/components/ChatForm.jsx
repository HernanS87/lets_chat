import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/firebase";
import { useAuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";
import { useAudioContext } from "../context/AudioContext";
import { toast } from "react-toastify";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { AiFillPlusCircle } from "react-icons/ai";
import { HiMicrophone } from "react-icons/hi";
import "react-toastify/dist/ReactToastify.css";
import EmojiPicker from "emoji-picker-react";
import ImagePopup from "./ImagePopup";
import AudioRecorder from "./AudioRecorder";

const ChatForm = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [textAreaScroll, setTextAreaScroll] = useState(false);
  const [cancelEdit, setCancelEdit] = useState(false);
  const [newAudio, setNewAudio] = useState(null);
  const { user } = useAuthContext();
  const txtAreaRef = useRef();
  const {
    activeChannel,
    msgToEdit,
    setMsgToEdit,

    uploadFile,
    fileURL,
    setFileURL,
    inputMessage,
    setInputMessage,
  } = useChatContext();

  const { activateMicro, startRecording } = useAudioContext();

  const handleMessage = async (e) => {
    e.preventDefault();
    const msgValue = inputMessage.trim();
    setInputMessage("");
    setCancelEdit(false);
    if (msgValue || fileURL || newAudio) {
      if (msgToEdit) {
        const msgRef = doc(
          db,
          `canales/${activeChannel}/mensajes/${msgToEdit.id}`
        );
        const imgURL = fileURL;
        setFileURL("");
        if (imgURL) {
          await updateDoc(msgRef, {
            ...msgToEdit,
            message: JSON.stringify(msgValue),
            file: imgURL,
            edited: true,
          });
        } else {
          await updateDoc(msgRef, {
            ...msgToEdit,
            message: JSON.stringify(msgValue),
            edited: true,
          });
        }
        setMsgToEdit("");
        toast.success("Mensaje editado correctamente!", {
          position: "top-center",
          autoClose: 1500,
        });
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
        className={`flex items-center w-screen px-4 pb-4 transition duration-500 ${
          activateMicro && "opacity-0 -translate-x-full"
        }`}
      >
        <div className="flex items-center w-full relative">
          {cancelEdit && (
            <div
              className="absolute top-neg-1 w-full bg-slate-900 text-xs text-slate-400 font-medium pl-2 py-1 rounded flex items-center cursor-pointer"
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
            className={`h-8 max-h-32 resize-none   dark:bg-slate-700 p-1 pl-9 outline-none dark:text-white  dark:placeholder:text-slate-400 bg-slate-300 flex-1 w-full rounded-md placeholder:text-xs md:placeholder:text-sm placeholder:text-slate-800 placeholder:font-medium ${
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
          <label htmlFor="images" className="absolute left-1 cursor-pointer ">
            <AiFillPlusCircle className="text-2xl text-gray-900 dark:text-slate-300" />
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
        <button
          type=""
          className={`bg-cyan-500 rounded-lg px-2 py-1 `}
          onClick={() => {
            if (!activateMicro && !inputMessage && !fileURL) {
              startRecording();
            }
          }}
        >
          <RiSendPlaneFill
            size={30}
            color={"#fff"}
            className={`${!inputMessage && !fileURL && "hidden"}`}
          />
          <HiMicrophone
            size={30}
            color={"#fff"}
            className={`${(inputMessage || fileURL) && "hidden"} `}
          />
        </button>
      </form>

      {/* AUDIORECORDER */}

      <AudioRecorder {...newAudio} />
    </>
  );
};

export default ChatForm;
