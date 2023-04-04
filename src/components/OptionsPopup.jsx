import { useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";

export default function OptionsPopup({
  setShowOptions,
  handleDelete,
  handleEdit,
  lastChildOptions,
}) {

  useEffect(() => {
    const handleEscape = (e) => {
      console.log("escape");
      if (e.keyCode === 27) {
        setShowOptions(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [])
  

  return (
    <>
      <div
        className="modal-container w-full h-full fixed top-0 left-0 z-10 "
        onClick={() => setShowOptions(false)}
      ></div>
      <div
        className={`bg-slate-900 text-sm font-medium text-gray-400 z-50 p-2 flex flex-col absolute rounded right-0 ${
          lastChildOptions ? "top-negative" : "top-0"
        }`}
      >
        <div
          className="flex justify-between w-40 py-1 px-1 rounded cursor-pointer hover:bg-cyan-500 hover:text-white transition-all ease-in-out mb-1 "
          onClick={() => {
            setShowOptions(false);
            handleEdit();
          }}
        >
          <span>Editar mensaje</span>
          <AiFillEdit size={20} />
        </div>
        <div
          className="flex justify-between w-40 py-1 px-1 rounded cursor-pointer hover:bg-red-500 hover:text-white transition-all ease-in-out"
          onClick={() => {
            setShowOptions(false);
            handleDelete();
          }}
        >
          <span>Eliminar mensaje</span>
          <AiFillDelete size={20} />
        </div>
      </div>
    </>
  );
}
