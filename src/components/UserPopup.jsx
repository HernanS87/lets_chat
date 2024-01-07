import { IoIosExit } from "react-icons/io";
import { useChatContext } from "../context/ChatContext";
import { MdDarkMode, MdLightMode } from "react-icons/md";

import { useEffect } from "react";
import { auth } from "../firebase/firebase";

function UserPopup() {
  const { setPopupUser, darkMode, setDarkMode } = useChatContext();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) {
        setPopupUser(false);
      }
    };

    const handleClick = () => {
      setPopupUser(false)
    }

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <div
        className={`bg-slate-900 text-sm font-medium text-gray-400 z-50 p-2 flex flex-col absolute rounded bottom-16 left-1/4 `}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex justify-between w-40 py-1 px-1 rounded cursor-pointer hover:bg-cyan-500 hover:text-white transition-all ease-in-out mb-1 "
          onClick={() => setDarkMode(!darkMode)}
        >
          <span>Tema</span>
          <div className="flex items-center">
            {!darkMode ? (
              <MdLightMode size={30} className="cursor-pointer" />
            ) : (
              <MdDarkMode size={30} className="cursor-pointer" />
            )}
          </div>
        </div>

        <div
          className="flex justify-between w-40 py-1 px-1 rounded cursor-pointer hover:bg-red-500 hover:text-white transition-all ease-in-out"
          onClick={() => {
            setPopupUser(false);
            auth.signOut();
          }}
        >
          <span>Salir</span>
          <IoIosExit size={25} />
        </div>
      </div>
    </>
  );
}

export default UserPopup;
