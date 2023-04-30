import { IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import sinImagen from "../assets/sinImagen.jpg";
import { IoMdReturnLeft } from "react-icons/io";


export default function ChannelImagePopup({ setChannelPopup }) {
  return (
    <div
      className="modal-conatiner w-full h-full fixed top-0 left-0 z-30 flex items-center justify-center bg-opacity-40 bg-black
    "
      onClick={() => setChannelPopup(false)}
    >
      <div
        className="w-96 h-96 rounded bg-slate-800 opacity-100 flex flex-col gap-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" flex justify-between items-center bg-slate-700 rounded-t py-2 px-4">
          <div className="cursor-pointer">
            <MdOutlineClose className="text-2xl"/>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <IoMdReturnLeft className="text-xl"/>
            <span className="text-xs">Cambiar</span>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <img
            src={sinImagen}
            alt=""
            className="w-64 aspect-square rounded-full opacity-30"
          />
          <IoCheckmarkSharp className="mt-10 absolute right-4 -bottom-10 text-2xl w-14 h-14 p-2 rounded-full bg-cyan-500 hover:opacity-90 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
