import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { BsThreeDots } from "react-icons/bs";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OptionsPopup from "./OptionsPopup";
import AudioPlayer from "./AudioPlayer";

const Message = ({
  username,
  avatar,
  timestamp,
  message,
  uid,
  id,
  edited,
  file,
  sameUser,
  audio,
}) => {
  const msgRef = useRef();
  const { user } = useAuthContext();
  const { activeChannel, setMsgToEdit, setFileURL } = useChatContext();
  const options = { hour: "numeric", minute: "numeric" };
  const date = new Date(timestamp);
  const [showHour, setShowHour] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [lastChildOptions, setLastChildOptions] = useState(false);

  
  const handleDelete = async () => {
    const docRef = doc(db, `canales/${activeChannel.id}/mensajes/${id}`);
    await deleteDoc(docRef);
  };
  
  const handleEdit = () => {
    setMsgToEdit({
      username,
      avatar,
      timestamp,
      message: JSON.parse(message).replace(/\\"/g, '"'),
      uid,
      id,
      edited,
      file,
    });
    setFileURL(file);
  };
  
  useEffect(() => {
    msgRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
  }, []);
  
  return (
    <li
      className="w-full shadow-md flex flex-col pl-4 pr-12 relative hover:bg-slate-850  transition-all ease-in-out"
      ref={msgRef}
      onMouseOver={() => {
        setShowHour(true);
      }}
      onMouseLeave={() => {
        setShowHour(false);
      }}
    >
      {showOptions && (
        <OptionsPopup
          setShowOptions={setShowOptions}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          lastChildOptions={lastChildOptions}
          audio={audio}
        />
      )}

      <div className={`flex items-center gap-2 ${sameUser ? "pt-3" : "pt-4"}`}>
        {!sameUser && (
          <img
            src={avatar}
            alt={username}
            className="w-10 aspect-square rounded-full"
          />
        )}

        <div
          className={`flex items-center flex-1 ${
            sameUser ? "justify-end" : "justify-between"
          }`}
        >
          {!sameUser && <h3 className="font-medium">{username}</h3>}

          {user.uid === uid && (
            <BsThreeDots
              className={`absolute text-lg text-slate-400 cursor-pointer ${
                !sameUser ? "top-4 right-1" : "top-1 right-1"
              } ${sameUser && !showHour ? "hidden" : " block"}`}
              onClick={(e) => {
                e.stopPropagation()
                console.log(e.pageY);
                if (e.pageY > 620) {
                  setLastChildOptions(true);
                } else {
                  setLastChildOptions(false);
                }
                setShowOptions(true);
              }}
            />
          )}
        </div>
      </div>
      {file && (
        <a href={file} target="_blank" className="w-fit">
          <img src={file} alt={uid} className="max-w-xs lg:max-w-xl pt-3 max-h-[300px] object-cover" />
        </a>
      )}
      {audio && <AudioPlayer {...audio} id={id}/>}
      <div className="">

      {message && (
        <p className={`${!sameUser && "pt-3"} break-words `}>
          {message.split("\\n").length > 1
            ? message
                .replace(/\\"/g, '"')
                .slice(1, -1)
                .split("\\n")
                .map((el, ind) => (
                  <span key={ind}>
                    <span>{el}</span>
                    <br />
                  </span>
                ))
            : message.replace(/\\"/g, '"').slice(1, -1)}
          <span className="italic text-xs text-slate-400 font-medium">
            {edited ? " (editado)" : ""}
          </span>
        </p>
      )}
      </div>
      <p
        className={`italic text-xs text-slate-400 self-end font-medium absolute bottom-0 right-1  ${
          sameUser && !showHour ? "hidden" : " block"
        }`}
      >
        {new Intl.DateTimeFormat("en-US", options).format(date).toLowerCase()}
      </p>
    </li>
  );
};

export default Message;
