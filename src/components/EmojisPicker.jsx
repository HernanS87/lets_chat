import EmojiPicker from "emoji-picker-react";
import { useEffect } from "react";

export default function EmojisPicker({ addEmoji, setShowPicker }) {
  useEffect(() => {
    const closePicker = () => {
      console.log('click')
      setShowPicker(false);
    };

    const handleEsc = (e) => {
      console.log("escape");
      if (e.keyCode === 27) {
        setShowPicker(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("click", closePicker);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("click", closePicker);
    };
  }, []);

  return (
    <div
      className="absolute right-10 bottom-20 z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <EmojiPicker height={350} width={300} onEmojiClick={addEmoji} />
    </div>
  );
}
