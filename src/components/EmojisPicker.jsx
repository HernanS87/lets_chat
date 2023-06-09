import EmojiPicker from "emoji-picker-react";
import { useEffect } from "react";

export default function EmojisPicker({ addEmoji, setShowPicker, newChannelForm }) {
  useEffect(() => {
    const closePicker = () => {
      console.log('click')
      setShowPicker(false);
    };

    // const handleEsc = (e) => {
    //   console.log("escape");
    //   if (e.keyCode === 27) {
    //     setShowPicker(false);
    //   }
    // };

    // document.addEventListener("keydown", handleEsc);
    document.addEventListener("click", closePicker);

    return () => {
      // document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("click", closePicker);
    };
  }, []);

  return (
    <div
      className={`${!newChannelForm ? "absolute right-10 bottom-20 z-10" : "absolute z-20 bottom-0 left-56 "}`}
      onClick={(e) => e.stopPropagation()}
    >
      <EmojiPicker height={350} width={300} onEmojiClick={addEmoji} className='z-50' />
    </div>
  );
}
