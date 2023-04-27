import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import ChatForm from "../components/ChatForm";
import Message from "../components/Message";
import Sidebar from "../components/Sidebar";
import { HashLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import sinImagen from "../assets/sinImagen.jpg";


const Chat = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [dates, setDates] = useState([]);
  const { activeChannel } = useChatContext();

  const getMessages = () => {
    if (activeChannel) {
      const msgRef = collection(db, `canales/${activeChannel}/mensajes`);

      const q = query(msgRef, orderBy("timestamp", "asc"));

      onSnapshot(q, (snap) => {
        const msgs = snap.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setAllMessages(msgs);
        const dates = [
          ...new Set(msgs.map((el) => new Date(el.timestamp).toDateString())),
        ];
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
    return nameDay;
  };

  const guessDate = (day, month, year) => {
    let nameMonth = "";
    switch (month) {
      case "1":
        nameMonth = "Enero";
        break;
      case "2":
        nameMonth = "Febrero";
        break;
      case "3":
        nameMonth = "Marzo";
        break;
      case "4":
        nameMonth = "Abril";
        break;
      case "5":
        nameMonth = "Mayo";
        break;
      case "6":
        nameMonth = "Junio";
        break;
      case "7":
        nameMonth = "Julio";
        break;
      case "8":
        nameMonth = "Agosto";
        break;
      case "9":
        nameMonth = "Septiembre";
        break;
      case "10":
        nameMonth = "Octubre";
        break;
      case "11":
        nameMonth = "Noviembre";
        break;
      case "12":
        nameMonth = "Diciembre";
        break;
      default:
        break;
    }
    return `${day} de ${nameMonth} de ${year}`;
  };

  const whatDayIsIt = (date) => {
    const dateInfo = new Date(date).toLocaleDateString().split("/");
    const dateDay = dateInfo[0];
    const dateMonth = dateInfo[1];
    const dateYear = dateInfo[2];
    const currentDate = new Date().toLocaleDateString().split("/");
    const currentDay = currentDate[0];
    const currentMonth = currentDate[1];
    const currentYear = currentDate[2];
    let itIs = "";

    if (dateMonth === currentMonth && dateYear === currentYear) {
      if (currentDay - dateDay == 0) {
        itIs = "Hoy";
      } else if (currentDay - dateDay == 1) {
        itIs = "Ayer";
      } else if (currentDay - dateDay > 1 && currentDay - dateDay <= 5) {
        itIs = guessNameDay(date);
      } else {
        itIs = guessDate(dateDay, dateMonth, dateYear);
      }
    } else {
      itIs = guessDate(dateDay, dateMonth, dateYear);
    }
    return itIs;
  };

  useEffect(() => {
    getMessages();
  }, [activeChannel]);

  return (
    <div className="flex">
      <Sidebar />
      {!activeChannel ? (
        <div className=" w-4/6 h-[calc(100vh-80px)] flex justify-center items-center">
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
      ) : (
          <div className="flex w-4/6 flex-col items-center justify-start ">
            <div className="w-full flex items-center px-2 gap-3 z-10 h-14 text-xl bg-slate-850">
            <img
                  src={sinImagen}
                  alt="sinPic"
                  className="w-10 aspect-square rounded-full"
                />
                <span>{activeChannel}</span>
            </div>
            {allMessages.length === 0 ? (
              <div className="absolute top-1/3 ">
                <HashLoader size={100} color={"#36d7b7"} />
              </div>
            ) : (
              <div className="w-full h-[calc(100vh-120px)] flex flex-col mt-1 pt-1 pb-1 items-center justify-start scrollbar-thin scroll-px-10 scrollbar-thumb-cyan-500 dark:scrollbar-track-gray-900 scrollbar-track-gray-200">
                {dates.map((date, index) => {
                  let refHour = 0;
                  const arrayTemp = allMessages.filter(
                    (el) => new Date(el.timestamp).toDateString() === date
                  );
                  return (
                    <div className="w-full flex flex-col items-center bg-slate-800" key={index}>
                      <h3 className="text-center text-gray-400 text-sm font-medium px-2 py-1 rounded bg-slate-900">
                        {whatDayIsIt(date)}
                      </h3>
                      <ul className="px-4 pt-5 w-full">
                        {arrayTemp.map((message, i) => {
                          let sameUser = false;
                          // sameUser es true cuando el mismo usuario escribió mjs continuos durante media hora. Si pasa mas de media hora del último mjs(con foto y nombre) y ningun otro usuario escribió, entonces vuelve a aparecer su foto y nombre
                          if (i > 0) {
                            const previousHour = new Date(
                              arrayTemp[i - 1].timestamp
                            ).getTime();
                            const currentHour = new Date(
                              message.timestamp
                            ).getTime();
                            if (i - 1 === 0) {
                              refHour = previousHour;
                            }
                            if (
                              arrayTemp[i - 1].uid === message.uid &&
                              (currentHour - previousHour) / 1000 < 1800
                            ) {
                              if (
                                refHour > 0 &&
                                (currentHour - refHour) / 1000 > 1800
                              ) {
                                refHour = currentHour;
                              } else {
                                sameUser = true;
                              }
                            } else {
                              refHour = currentHour;
                            }
                          }
                          return (
                            
                            <Message
                              key={message.id}
                              {...message}
                              sameUser={sameUser}
                            />
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          {activeChannel && (
            <section className="fixed w-4/6 bottom-0 left-1/3">
              <ChatForm />
            </section>
          )}
          </div>
        
      )}
    </div>
  );
};

export default Chat;
