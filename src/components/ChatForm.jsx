import { useEffect, useState, useRef } from "react";
import { useChatContext } from "../context/ChatContext";
import { useAudioContext } from "../context/AudioContext";
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
  const txtAreaRef = useRef();
  const {
    activeChannel,
    msgToEdit,
    setMsgToEdit,
    fileURL,
    setFileURL,
    inputMessage,
    setInputMessage,
    handleMessage,
    handleFileChange,
    cancelEdit,
    setCancelEdit,
  } = useChatContext();

  const { activateMicro, startRecording } = useAudioContext();

  const addEmoji = (code) => {
    const emoji = String.fromCodePoint(`0x${code.unified}`);
    setInputMessage((prevInputMessage) => prevInputMessage + ` ${emoji}`);
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      setMsgToEdit("");
      setInputMessage("");
      setFileURL("");
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
        onSubmit={(e) => {
          e.preventDefault();
        }}
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
                setFileURL("");
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
                handleMessage();
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
            } else {
              handleMessage();
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

      <AudioRecorder />
    </>
  );
};

export default ChatForm;
