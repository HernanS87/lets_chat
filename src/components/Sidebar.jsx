import { useEffect, useState } from "react";
import sinImagen from "../assets/sinImagen.jpg";
import { useChatContext } from "../context/ChatContext";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Sidebar() {
  const [allChannels, setAllChannels] = useState([]);
  const { setActiveChannel } = useChatContext();

  const getChannels = () => {
    const channelsRef = collection(db, "canales");
    const unsub = onSnapshot(channelsRef, (snap) => {
      setAllChannels(
        snap.docs.map((doc) => ({
          ...doc.data(),
        }))
      );
    });

    return unsub;
  };

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <section className="flex flex-col gap-3 relative items-center p-2 bg-gray-500 h-screen w-1/4">
      <div className="bg-slate-800 p-1">
        <input type="text" placeholder="buscador" />
      </div>
      <nav className="w-full absolute top-12 h-[calc(100vh-48px)] bg-slate-700 scrollbar-thin scroll-px-10 scrollbar-thumb-cyan-500 dark:scrollbar-track-gray-900 scrollbar-track-gray-200">
        <ul className=" ">
          {allChannels.map((channel) => (
            <li
              key={channel.nombre}
              className="border-b-2 bg-slate-300 border-slate-900 px-1 py-2 cursor-pointer"
              onClick={() => {
                console.log(channel.nombre);
                setActiveChannel(channel.nombre);
              }}
            >
              <div className="flex gap-2 items-center">
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
    </section>
  );
}
