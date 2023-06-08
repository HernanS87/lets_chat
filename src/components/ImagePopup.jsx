import { useEffect } from "react";
import { useChatContext } from "../context/ChatContext";
import { MdOutlineClose } from "react-icons/md";

const ImagePopup = () => {
  const { fileURL, setFileURL } = useChatContext();

  const handleDelete = () => {
    setFileURL(null);
  };

  const handleEscape = (e) => {
    if (e.keyCode === 27) {
      console.log("esc de imagePopup")
      handleDelete();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="max-w-md max-h-96 h-80 rounded-lg mx-auto px-4 relative  bg-slate-700 flex justify-center items-center p-2">
      <div className=" flex justify-center items-center ">
        <MdOutlineClose
          size={30}
          className="absolute top-2 right-2 text-gray-400  cursor-pointer"
          onClick={handleDelete}
        />
        <img
          src={fileURL}
          alt="imagen subida"
          className=" object-cover max-h-[300px] max-w-xs"
        />
      </div>
    </div>
  );
};

export default ImagePopup;
