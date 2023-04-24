import {
  IoMdArrowRoundBack,
  IoMdCamera,
} from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { useChatContext } from "../context/ChatContext";
import sinImagen from "../assets/sinImagen.jpg";
import { useEffect } from "react";



export default function NewChannelForm() {
  const { setNewChannel } = useChatContext();

  useEffect(() => {
    
    const handleEsc = (e) => {
      console.log("escape");
      if (e.keyCode === 27) {
        setNewChannel(false);
      }
    };

    const handleClick = () => {
      console.log('newchannel click')
      setNewChannel(false)
    }

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <form
      className="flex flex-col z-10 gap-10 text-lg items-center h-screen w-1/3 bg-slate-850"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className="w-full flex items-center px-3 py-2 gap-5 z-50 h-14 ">
        <IoMdArrowRoundBack
          color={"#06B6D4"}
          className="cursor-pointer text-3xl"
          onClick={() => setNewChannel(false)}
        />
        <span className="text-xl">Nuevo Canal</span>
      </div>
      <div className="cursor-pointer">
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
      <div className="w-52 mt-6">
        <input
          type="text"
          placeholder="Nombre"
          name=""
          id=""
          className="bg-transparent text-sm w-full py-1 border-b border-cyan-500 outline-none"
        />
      </div>
      <div>
        <IoCheckmarkSharp className="mt-10 text-2xl w-10 h-10 p-1 rounded-full bg-cyan-500 hover:opacity-90 cursor-pointer">
          Crear
        </IoCheckmarkSharp>
      </div>
    </form>
  );
}
