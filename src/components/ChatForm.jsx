import { useEffect, useState, useRef } from "react";
import { useChatContext } from "../context/ChatContext";
import { useAudioContext } from "../context/AudioContext";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiSendPlaneFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { AiFillPlusCircle } from "react-icons/ai";
import { HiMicrophone } from "react-icons/hi";
import "react-toastify/dist/ReactToastify.css";
import ImagePopup from "./ImagePopup";
import AudioRecorder from "./AudioRecorder";
import EmojisPicker from "./EmojisPicker";

const ChatForm = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [textAreaScroll, setTextAreaScroll] = useState(false);
  const {
    activeChannel,
    msgToEdit,
    setMsgToEdit,
    fileURL,
    setFileURL,
    textAreaValue,
    setTextAreaValue,
    handleMessage,
    handleFileChange,
    cancelEdit,
    setCancelEdit,
    txtAreaRef,
  } = useChatContext();

  const { activateMicro, startRecording } = useAudioContext();

  const addEmoji = (data) => {
    txtAreaRef.current.value = txtAreaRef.current.value + data.emoji;
    setTextAreaValue(true)
    adjustSize()
  };

  const adjustSize = () => {
    if (txtAreaRef.current.scrollHeight > 40 && txtAreaRef.current.value) {
      txtAreaRef.current.style.height = "auto";
      txtAreaRef.current.style.height = txtAreaRef.current.scrollHeight + "px";
      if (txtAreaRef.current.scrollHeight > 128) {
        setTextAreaScroll(true);
      } else {
        setTextAreaScroll(false);
      }
    } else if (txtAreaRef.current.value == "") {
      txtAreaRef.current.style.height = "32px";
      setTextAreaScroll(false);
    }
  };

  const sendEditedMsg = () => {
    txtAreaRef.current.value = "";
    setMsgToEdit("");
    setTextAreaValue(false);
    setFileURL("");
    setCancelEdit(false);
  };
  const handleEscape = (e) => {
    if (e.keyCode === 27 && msgToEdit) {
      console.log('esc de chatform')
      sendEditedMsg();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    if (msgToEdit) {
      txtAreaRef.current.value = msgToEdit.message;
      setTextAreaValue(true);
      setCancelEdit(true);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [msgToEdit]);

  useEffect(() => {
    adjustSize();
  }, [textAreaValue]);

  return (
    <>
      {fileURL && <ImagePopup />}
      {showPicker && <EmojisPicker addEmoji={addEmoji} setShowPicker={setShowPicker}  />}
      <form
        id="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className={`flex items-center w-full px-2 pb-4 transition duration-500 ${
          activateMicro && "opacity-0 -translate-x-full"
        }`}
      >
        <div className="flex items-center w-full relative">
          {cancelEdit && (
            <div
              className="absolute top-neg-1 w-full bg-slate-900 text-xs text-slate-400 font-medium pl-2 py-1 rounded flex items-center cursor-pointer"
              onClick={sendEditedMsg}
            >
              <MdCancel size={15} className="mr-1" />
              Editando mensaje
            </div>
          )}

          <textarea
            type="text"
            ref={txtAreaRef}
            placeholder={`Escribe un mensaje en ${activeChannel.name}`}
            rows={1}
            className={`h-8 max-h-32 resize-none   dark:bg-slate-700 p-1 pl-9 outline-none dark:text-white  dark:placeholder:text-slate-400 bg-slate-300 flex-1 w-full rounded-md placeholder:text-xs md:placeholder:text-sm placeholder:text-slate-800 placeholder:font-medium ${
              !textAreaValue && "py-2 leading-4"
            } ${
              textAreaScroll
                ? "scrollbar-thin scrollbar-thumb-cyan-500 hover:scrollbar-thumb-cyan-300"
                : "overflow-y-hidden"
            }`}
            onChange={(e) => {
              if (e.target.value) {
                setTextAreaValue(true);
              } else {
                setTextAreaValue(false);
              }
              adjustSize();
            }}
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
          onClick={(e) => {
            e.stopPropagation()
            setShowPicker(!showPicker)}}
        />
        <button
          type=""
          className={`bg-cyan-500 rounded-lg px-2 py-1 `}
          onClick={() => {
            if (!activateMicro && !textAreaValue && !fileURL) {
              startRecording();
            } else {
              handleMessage();
            }
          }}
        >
          <RiSendPlaneFill
            size={30}
            color={"#fff"}
            className={`${!textAreaValue && !fileURL && "hidden"}`}
          />
          <HiMicrophone
            size={30}
            color={"#fff"}
            className={`${(textAreaValue || fileURL) && "hidden"} `}
          />
        </button>
      </form>

      {/* AUDIORECORDER */}

      <AudioRecorder />
    </>
  );
};

export default ChatForm;
