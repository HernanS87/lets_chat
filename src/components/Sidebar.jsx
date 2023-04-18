import { useEffect, useState } from "react";
import sinImagen from "../assets/sinImagen.jpg";
import { useChatContext } from "../context/ChatContext";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { IoMdChatboxes } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useAuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const [allChannels, setAllChannels] = useState([]);
  const { setActiveChannel } = useChatContext();

  const [darkMode, setDarkMode] = useState(false);
  const { user } = useAuthContext();
  const { popupUser, setPopupUser } = useChatContext();

  const getChannels = () => {
    const channelsRef = collection(db, "canales");
    onSnapshot(channelsRef, (snap) => {
      setAllChannels(
        snap.docs.map((doc) => ({
          ...doc.data(),
        }))
      );
    });
  };

  useEffect(() => {
    getChannels();
  }, []);

  useEffect(() => {
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <section className="flex flex-col z-10 gap-2 font-semibold text-lg items-center pt-20 h-screen w-1/3 bg-slate-850">
      {/* <div className="bg-slate-800 p-1">
        <input type="text" placeholder="buscador" />
      </div> */}
      <nav className="w-full h-[calc(100vh)]  scrollbar-thin scroll-px-10 scrollbar-thumb-cyan-500 dark:scrollbar-track-gray-900 scrollbar-track-gray-200">
        <ul className="p-1 gap-2 ">
          {allChannels.map((channel) => (
            <li
              key={channel.nombre}
              className=" rounded  px-2 py-2 mb-1 cursor-pointer hover:bg-slate-900"
              onClick={() => {
                console.log(channel.nombre);
                setActiveChannel(channel.nombre);
              }}
            >
              <div className="flex gap-4 items-center">
                <img
                  src={sinImagen}
                  alt="sinPic"
                  className="w-10 aspect-square rounded-full"
                />
                <span>{channel.nombre}</span>
              </div>{" "}
            </li>
          ))}
        </ul>
      </nav>
      <div className=" w-full bg-slate-900 py-2">
        <ul className="flex justify-between flex-wrap items-center px-2">
          {/* <li>
							<IoMdChatboxes size={45} color={'#06B6D4'} />
						</li> */}
          <li className="flex items-center gap-1">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-12 aspect-square rounded-full"
              // onClick={() => setPopupUser(true)}
            />
            <span>{user.displayName}</span>
          </li>
          <li className="flex items-center">
            {!darkMode ? (
              <MdLightMode
                size={30}
                className="cursor-pointer"
                onClick={() => setDarkMode(!darkMode)}
              />
            ) : (
              <MdDarkMode
                size={30}
                className="cursor-pointer"
                onClick={() => setDarkMode(!darkMode)}
              />
            )}
          </li>
        </ul>
      </div>
    </section>
  );
}
