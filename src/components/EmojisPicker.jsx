import EmojiPicker from "emoji-picker-react";
import { useEffect } from "react";
import { useChatContext } from "../context/ChatContext";

export default function EmojisPicker({
  addEmoji,
  setShowPicker,
  newChannelForm,
  whichPicker,
}) {
  const { listOfComponentsToClose, setListOfComponentsToClose } =
    useChatContext();
  useEffect(() => {
    
    const closePicker = () => {
      console.log("click");
      setShowPicker(false);
      setListOfComponentsToClose(
        listOfComponentsToClose.filter((component) => component != whichPicker)
      );
    };

    document.addEventListener("click", closePicker);

    return () => {
      document.removeEventListener("click", closePicker);
    };
  }, [listOfComponentsToClose]);

  return (
    <div
      className={`${
        !newChannelForm
          ? "absolute right-10 bottom-20 z-10"
          : "absolute z-20 bottom-0 left-56 "
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <EmojiPicker
        height={350}
        width={300}
        onEmojiClick={addEmoji}
        className="z-50"
      />
    </div>
  );
}
