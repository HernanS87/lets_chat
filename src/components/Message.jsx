import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
}) => {
  const msgRef = useRef();
  const { user } = useAuthContext();
  const { activeChannel, changeMsgToEdit } = useChatContext();
  const options = { hour: "numeric", minute: "numeric" };
  const date = new Date(timestamp);
  const [showHour, setShowHour] = useState(false);

  useEffect(() => {
    msgRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
  }, []);

  const handleDelete = async () => {
    const docRef = doc(db, `canales/${activeChannel}/mensajes/${id}`);
    await deleteDoc(docRef);
    toast.success("Mensaje eliminado correctamente!", {
      position: "top-center",
      autoClose: 1500,
    });
  };

  const handleEdit = async () => {
    changeMsgToEdit({
      username,
      avatar,
      timestamp,
      message: JSON.parse(message).replace(/\\"/g, '"'),
      uid,
      id,
      edited,
      file,
    });
  };

  return (
    <div
      className="shadow-md flex flex-col pl-4 pr-12 relative "
      ref={msgRef}
      onMouseOver={() => {
        setShowHour(true);
      }}
      onMouseLeave={() => {
        setShowHour(false);
      }}
    >
      <div className={`flex items-center gap-2 ${sameUser ? "pt-2" : "pt-4"}`}>
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
            <div className="flex gap-5">
              {!file && (
                <AiFillEdit
                  size={20}
                  className="cursor-pointer text-slate-400 hover:text-cyan-500 transition-all ease-in-out"
                  onClick={handleEdit}
                />
              )}
              <AiFillDelete
                size={20}
                className="cursor-pointer text-slate-400 hover:text-cyan-500 transition-all ease-in-out"
                onClick={handleDelete}
              />
            </div>
          )}
        </div>
      </div>
      {file && (
        <a href={file} target="_blank" className="w-fit">
          <img src={file} alt={uid} className="max-w-xs lg:max-w-xl pt-3" />
        </a>
      )}
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
      <p
        className={`italic text-xs text-slate-400 self-end font-medium absolute bottom-0 right-1 ${
          sameUser && !showHour ? "hidden" : " block"
        }`}
      >
        {new Intl.DateTimeFormat("en-US", options).format(date).toLowerCase()}
      </p>
    </div>
  );
};

export default Message;
