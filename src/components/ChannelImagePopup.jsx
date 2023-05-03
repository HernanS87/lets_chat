import { IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import sinImagen from "../assets/sinImagen.jpg";
import { IoMdReturnLeft } from "react-icons/io";
import { useChatContext } from "../context/ChatContext";
import { HashLoader } from "react-spinners";

export default function ChannelImagePopup({
  setChannelPopup,
  handleChange,
  loadingImage,
}) {
  const { tempChannelImage, setTempChannelImage, setChannelImage } =
    useChatContext();
  return (
    <div
      className="modal-conatiner w-full h-full fixed top-0 left-0 z-30 flex items-center justify-center bg-opacity-60 bg-black
    "
      onClick={() => {
        setChannelPopup(false);
        setTempChannelImage(false);
      }}
    >
      <div
        className="w-96 h-96 rounded relative bg-slate-800 flex flex-col gap-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" flex justify-between items-center bg-slate-700 rounded-t py-2 px-4">
          <div
            className="cursor-pointer"
            onClick={() => {
              setChannelPopup(false);
              setTempChannelImage(false);
            }}
          >
            <MdOutlineClose className="text-2xl" />
          </div>
          <label
            htmlFor="changeImage"
            className="flex items-center gap-1 cursor-pointer"
          >
            <IoMdReturnLeft className="text-xl" />
            <span className="text-xs">Cambiar</span>
            <input
              type="file"
              className="hidden"
              id="changeImage"
              // multiple
              accept="image/*"
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="relative flex items-center justify-center">
          <img
            src={tempChannelImage ? tempChannelImage : sinImagen}
            alt=""
            className={`w-64 aspect-square object-cover rounded-full ${
              !tempChannelImage && "opacity-30"
            }`}
          />
          <IoCheckmarkSharp
            className="mt-10 absolute right-4 -bottom-10 text-2xl w-14 h-14 p-2 rounded-full bg-cyan-500 hover:opacity-90 cursor-pointer"
            onClick={() => {
              setChannelImage(tempChannelImage);
              setChannelPopup(false);
              setTempChannelImage(false);
            }}
          />
        </div>
        {loadingImage && (
          <div className="absolute w-full h-full flex items-center justify-center bg-black bg-opacity-60">
            <HashLoader size={50} color={"#36d7b7"} />
          </div>
        )}
      </div>
    </div>
  );
}
