import { createContext, useContext, useState, useRef } from "react";
import { db, storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { useAuthContext } from "./AuthContext";

const AudioContext = createContext();

export const AudioContextProvider = ({ children }) => {
  const { user } = useAuthContext();

  const [activateMicro, setActivateMicro] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [newAudio, setNewAudio] = useState(null);

  const [centesimas, setCentesimas] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef(null);

  const [progressPercentage, setProgressPercentage] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);

  const [justOnePlayer, setJustOnePlayer] = useState(null);

  const [channel, setChannel] = useState(null);

  const uploadAudio = async (file) => {
    const storageRef = ref(storage, `audio/${v4()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCentesimas((centesimas) => centesimas + 1);
    }, 100);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const currentTimer = () => {
    const segundos = centesimas / 10;
    const currentMin = Math.floor(segundos / 60);
    const currentSec = Math.floor(segundos - currentMin * 60)
      .toString()
      .padStart(2, "0");

    setRecordingTime(`${currentMin}:${currentSec}`);

    if (segundos === 120.5) {
      stopRecording(channel);
    }
  };

  const startRecording = async () => {
    setActivateMicro(true);
    setIsRecording(true);
    startTimer();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
  };

  const stopRecording = async (activeChannel) => {
    setActivateMicro(false);
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    console.log(centesimas / 10);
    stopTimer();
    setCentesimas(0);
    mediaRecorderRef.current.addEventListener("dataavailable", async (e) => {
      const audioBlob = e.data;
      const audioUrl = await uploadAudio(audioBlob);
      console.log("url de storage", audioUrl);

      const msgRef = collection(db, `canales/${activeChannel}/mensajes`);
      await addDoc(msgRef, {
        username: user.displayName,
        uid: user.uid,
        avatar: user.photoURL,
        message: "",
        file: "",
        timestamp: Date.now(),
        audio: {
          urlStream: audioUrl,
          duration: centesimas / 10,
        },
      });
      console.log("se envio el audio");
    });
  };

  const pauseRecording = () => {
    mediaRecorderRef.current.pause();
    stopTimer();
    setIsRecording(false);
  };

  const resumeRecording = () => {
    startTimer();
    mediaRecorderRef.current.resume();
    setIsRecording(true);
  };

  const cancelRecording = () => {
    stopTimer();
    setCentesimas(0);
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setActivateMicro(false);
  };

  return (
    <AudioContext.Provider
      value={{
        activateMicro,
        setActivateMicro,
        isRecording,
        setIsRecording,
        centesimas,
        mediaRecorderRef,
        newAudio,
        setNewAudio,
        setProgressPercentage,
        recordingTime,
        progressPercentage,
        marginLeft,
        setMarginLeft,
        currentTimer,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        cancelRecording,
        justOnePlayer,
        setJustOnePlayer,
        setChannel,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);

  if (!context)
    throw new Error("useAudioContext must be used within an AuthProvider");
  return context;
};
