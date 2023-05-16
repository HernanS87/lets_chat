import { useEffect, useState } from "react";
import sinImagen from "../assets/sinImagen.jpg";
import { useChatContext } from "../context/ChatContext";
import { db } from "../firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { IoMdChatboxes, IoMdSettings } from "react-icons/io";
import { useAuthContext } from "../context/AuthContext";
import UserPopup from "./UserPopup";
import { AiFillPlusCircle } from "react-icons/ai";
import NewChannelForm from "./NewChannelForm";
import { HashLoader } from "react-spinners";

export default function Sidebar() {
  const [allChannels, setAllChannels] = useState(null);
  const { setActiveChannel, editActiveChannel } = useChatContext();

  const { user } = useAuthContext();
  const { popupUser, setPopupUser, newChannel, setNewChannel } =
    useChatContext();

  const getChannels = () => {
    const channelsRef = collection(db, "canales");
    onSnapshot(channelsRef, (snap) => {
      setAllChannels(
        snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });
  };

  useEffect(() => {
    getChannels();
  }, []);

  return !newChannel && !editActiveChannel ? (
    <section
      className="flex flex-col z-10 gap-2 font-semibold text-lg items-center h-screen w-1/3 bg-slate-850"
      onClick={(e) => {
        e.stopPropagation();
        setPopupUser(false);
      }}
    >
      {/* <div className="bg-slate-800 p-1">
        <input type="text" placeholder="buscador" />
      </div> */}
      <div className="w-full flex items-center px-2 py-2 gap-3 z-50 h-14 text-2xl font-mono ">
        <IoMdChatboxes size={45} color={"#06B6D4"} />

        <span>Let's Chat</span>
      </div>
      <div
        className="relative w-full rounded px-2 py-2 mb-1 cursor-pointer border-l-4 border-transparent hover:border-cyan-500"
        onClick={() => setNewChannel(true)}
      >
        <div className=" flex gap-4 items-center justify-between left-1 cursor-pointer ">
          <span>Nuevo canal</span>
          <AiFillPlusCircle className="text-2xl text-gray-900 dark:text-slate-300" />
        </div>
      </div>
      <nav className="w-full h-full  scrollbar-thin scroll-px-10 scrollbar-thumb-cyan-500 dark:scrollbar-track-gray-900 scrollbar-track-gray-200">
        <ul className="h-full px-1 gap-0 flex flex-col ">
          {allChannels ? (
            allChannels.map((channel, index) => (
              <li
                key={index}
                className=" rounded  px-2 py-2 mb-1 cursor-pointer hover:bg-slate-900"
                onClick={() => {
                  setActiveChannel({ ...channel });
                }}
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={channel.image ? channel.image : sinImagen}
                    alt="sinPic"
                    className="w-11 aspect-square object-cover rounded-full"
                  />
                  <span>{channel.name}</span>
                </div>{" "}
              </li>
            ))
          ) : (
            <li className="h-[calc(100%-160px)]  flex items-center justify-center ">
              <div className=" flex items-center justify-center ">
                <HashLoader size={50} color={"#36d7b7"} />
              </div>
            </li>
          )}
        </ul>
      </nav>
      <div className=" w-full bg-slate-900 py-2">
        <ul className="flex justify-between flex-wrap items-center px-2">
          <li className="flex items-center gap-1">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-12 aspect-square rounded-full"
            />
            <span>{user.displayName}</span>
          </li>
          <li
            className="flex items-center text-2xl cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setPopupUser(!popupUser);
            }}
          >
            <IoMdSettings />
          </li>
        </ul>
        {popupUser && <UserPopup />}
      </div>
    </section>
  ) : (
    <NewChannelForm />
  );
}
