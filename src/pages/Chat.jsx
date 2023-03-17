import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import ChatForm from "../components/ChatForm";
import Message from "../components/Message";
import { HashLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";

const Chat = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [dates, setDates] = useState([]);
  const { activeChannel } = useChatContext();

  const getMessages = () => {
    if (activeChannel) {
      const msgRef = collection(db, `canales/${activeChannel}/mensajes`);

      const q = query(msgRef, orderBy("timestamp", "asc"));

      onSnapshot(q, (snap) => {
        console.log("ejecutando snapshot");
        const msgs = snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAllMessages(msgs);
        const dates = [
          ...new Set(msgs.map((el) => new Date(el.timestamp).toDateString())),
        ];
        console.log("dias", dates);
        setDates(dates);
      });
    }
  };

  const guessNameDay = (date) => {
    const day = new Date(date).getDay();
    let nameDay = "";

    switch (day) {
      case 0:
        nameDay = "Domingo";
        break;
      case 1:
        nameDay = "Lunes";
        break;
      case 2:
        nameDay = "Martes";
        break;
      case 3:
        nameDay = "Miércoles";
        break;
      case 4:
        nameDay = "Jueves";
        break;
      case 5:
        nameDay = "Viernes";
        break;
      case 6:
        nameDay = "Sábado";
        break;
      default:
        break;
    }

    return nameDay
  };

  const whatDayIsIt = (date) => {
    const dateInfo = new Date(date).toLocaleDateString().split("/");
    const dateDay = dateInfo[0];
    const dateMonth = dateInfo[1];
    const currentDate = new Date().toLocaleDateString().split("/");
    const currentDay = currentDate[0];
    const currentMonth = currentDate[1];

    if (date === new Date().toDateString()) {
      return "Hoy";
    }

    if (dateMonth === currentMonth) {
      if (currentDay - dateDay == 1) {
        return "Ayer";
      } else if (currentDay - dateDay > 1 && currentDay - dateDay <= 5) {
        return guessNameDay(date);
      } else {
        return new Date(date).toLocaleDateString();
      }
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  useEffect(() => {
    getMessages();
  }, [activeChannel]);

  if (!activeChannel)
    return (
      <div className="h-[calc(100vh-80px)] flex justify-center items-center">
        <h2 className="text-lg md:text-xl font-medium space-x-2">
          <span>Selecciona o</span>
          <Link
            to="/create-channel"
            className="text-cyan-500 hover:text-cyan-700 transition-all ease-in-out"
          >
            crea
          </Link>
          <span>un canal para comenzar a chatear</span>
        </h2>
      </div>
    );

  // overflow-scroll overflow-x-hidden scrollbar scrollbar-thumb-cyan-500 dark:scrollbar-track-gray-900 scrollbar-track-gray-200
  return (
    <>
      <div className="absolute top-20 w-full h-[calc(100vh-140px)] flex items-start justify-center scrollbar scrollbar-thumb-cyan-500 dark:scrollbar-track-gray-900 scrollbar-track-gray-200">
        {allMessages.length === 0 ? (
          <div className="absolute top-1/3 ">
            <HashLoader size={100} color={"#36d7b7"} />
          </div>
        ) : (
          <div className="w-3/4 ">
            {dates.map((date) => {
              const arrayTemp = allMessages.filter(
                (el) => new Date(el.timestamp).toDateString() === date
              );
              return (
                <>
                  <h3 className="text-center">{whatDayIsIt(date)}</h3>
                  <ul className="px-4 pt-5">
                    {arrayTemp.map((message) => (
                      <Message key={message.id} {...message} />
                    ))}
                  </ul>
                </>
              );
            })}
          </div>
        )}
      </div>
      {activeChannel && (
        <section className="fixed bottom-0">
          <ChatForm />
        </section>
      )}
    </>
  );
};

export default Chat;
