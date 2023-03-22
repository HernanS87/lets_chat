import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { db } from "../firebase/firebase";
import { useChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import "react-toastify/dist/ReactToastify.css";
import EmojiPicker from "emoji-picker-react";
import ImagePopup from "./ImagePopup";

const ChatForm = () => {
  const [showPicker, setShowPicker] = useState(false);
  const { user } = useAuthContext();
  const {
    activeChannel,
    msgToEdit,
    changeMsgToEdit,
    uploadFile,
    fileURL,
    setFileURL,
    inputMessage,
    setInputMessage,
  } = useChatContext();

  const handleMessage = async (evt) => {
    evt.preventDefault();
    const msgValue = inputMessage;
    setInputMessage("");
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
  };

  const handleFileChange = async (evt) => {
    setFileURL("");
    if (!evt.target.files[0].type.includes("image")) {
      evt.target.value = null;
      return toast.error("Solo puedes subir imagenes!", {
        position: "top-center",
        autoClose: 2500,
      });
    }
    try {
      const result = await uploadFile(evt.target.files[0]);
      setFileURL(result);
      evt.target.value = null;
    } catch (error) {
      toast.error("Ha ocurrido un error, intentalo mas tarde", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  };

  useEffect(() => {
    if (msgToEdit) {
      setInputMessage(msgToEdit.message);
    }
  }, [msgToEdit]);

  const addEmoji = (code) => {
    const emoji = String.fromCodePoint(`0x${code.unified}`);
    setInputMessage((prevInputMessage) => prevInputMessage + ` ${emoji}`);
  };

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
        <textarea
          type="text"
          placeholder={`Escribe un mensaje en ${activeChannel} 😀`}
          // style={{ height: 'auto', minHeight: 'px' }}
          className={`h-8 max-h-32 resize-none dark:bg-slate-700 p-1 pl-10 outline-none dark:text-white dark:placeholder:text-slate-400 bg-slate-300 flex-1 w-full rounded-md placeholder:text-xs md:placeholder:text-sm xl:placeholder:text-lg placeholder:text-slate-800 placeholder:font-medium ${
            !inputMessage && "py-2"
          }`}
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value);
            // e.target.style.height = "auto";
            // e.target.style.height = e.target.scrollHeight + "px";
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              console.log("Presuinaste Enter");

              handleMessage(e);
              // setInputMessage(inputMessage + "\n");
            }
          }}
        />
        <div className="bg-gray-500 w-6 h-6 rounded-full absolute left-5 cursor-pointer">
          <p className="text-2xl font-bold w-full absolute flex justify-center leading-5 cursor-pointer ">
            +
          </p>
          <input
            type="file"
            className="bg-gray-500 w-full rounded-full absolute left-0 top-0 bottom-0 right-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
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
