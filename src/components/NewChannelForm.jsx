import {
  IoMdArrowRoundBack,
  IoMdCamera,
} from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import sinImagen from "../assets/sinImagen.jpg";
import { useEffect, useRef, useState } from "react";
import EmojisPicker from "./EmojisPicker";
import ChannelImagePopup from "./ChannelImagePopup";




export default function NewChannelForm() {
  const { setNewChannel } = useChatContext();
  const [showPicker, setShowPicker] = useState(false);
  const [channelPopup, setChannelPopup] = useState(false)
  const inputRef = useRef()

  const addEmoji = (data) => {
    inputRef.current.value = inputRef.current.value + data.emoji;
  };

  useEffect(() => {
    
    const handleEsc = (e) => {
      console.log("escape");
      if (e.keyCode === 27) {
        setNewChannel(false);
      }
    };

    // const handleClick = () => {
    //   console.log('newchannel click')
    //   if (showPicker)
    //   setNewChannel(false)
    // }

    document.addEventListener("keydown", handleEsc);
    // document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      // document.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <form
      className="flex flex-col z-20 gap-10 text-lg items-center h-screen w-1/3 bg-slate-850"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowPicker(false)
      }}
    >
      <div className="w-full flex items-center px-3 py-2 gap-5 h-14 ">
        <IoMdArrowRoundBack
          color={"#06B6D4"}
          className="cursor-pointer text-3xl"
          onClick={() => setNewChannel(false)}
        />
        <span className="text-xl">Nuevo Canal</span>
      </div>
      <div className="cursor-pointer" onClick={() => setChannelPopup(true)}>
        <div className="relative flex items-center justify-center">
          <div className="absolute flex flex-col items-center gap-0 justify-center">
            <IoMdCamera className="text-2xl" />
            <span className="text-sm">AÑADIR IMAGEN</span>
          </div>
          <img
            src={sinImagen}
            alt=""
            className="w-40 aspect-square rounded-full opacity-30"
          />
        </div>

      </div>
      {channelPopup && <ChannelImagePopup setChannelPopup={setChannelPopup} />}
      <div className="w-52 mt-6 relative flex items-center border-b border-cyan-500 ">
        <input
          type="text"
          placeholder="Nombre"
          name=""
          id=""
          ref={inputRef}
          maxLength={24}
          className="bg-transparent text-sm w-full py-1 outline-none"
        />
        <MdOutlineEmojiEmotions
          className="cursor-pointer mx-1"
          size={30}
          onClick={(e) => {
            e.stopPropagation()
            setShowPicker(!showPicker)}}
        />
        {showPicker && <EmojisPicker addEmoji={addEmoji} setShowPicker={setShowPicker} newChannelForm={true} />}
      </div>
      <div>
        <IoCheckmarkSharp className="mt-10 text-2xl w-10 h-10 p-2 rounded-full bg-cyan-500 hover:opacity-90 cursor-pointer" />
      </div>
    </form>
  );
}
