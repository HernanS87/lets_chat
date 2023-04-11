import { createContext, useContext, useState, useRef } from "react";
import { storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useChatContext } from "./ChatContext";

const AudioContext = createContext();

export const AudioContextProvider = ({ children }) => {
  const { handleMessage } = useChatContext();

  const [activateMicro, setActivateMicro] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [newAudio, setNewAudio] = useState(null);

  const [decimas, setDecimas] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef(null);

  const [justOnePlayer, setJustOnePlayer] = useState(null);

  const uploadAudio = async (file) => {
    const storageRef = ref(storage, `audio/${v4()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setDecimas((decimas) => decimas + 1);
    }, 100);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const startRecording = async () => {
    setActivateMicro(true);
    setIsRecording(true);
    startTimer();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.start();
  };

  const stopRecording = async () => {
    setActivateMicro(false);
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    setDecimas(0);
    console.log(decimas / 10);
    stopTimer();
    mediaRecorderRef.current.addEventListener("dataavailable", async (e) => {
      const audioBlob = e.data;
      const audioUrl = await uploadAudio(audioBlob);
      console.log("url de storage", audioUrl);
      const metaAudio = {
        urlStream: audioUrl,
        duration: decimas / 10,
      };
      handleMessage(metaAudio);
      console.log("se envio el audio");
    });
  };

  const pauseRecording = () => {
    mediaRecorderRef.current.pause();
    stopTimer();
    setDecimas(decimas + 0.3);
    setIsRecording(false);
  };

  const resumeRecording = () => {
    startTimer();
    mediaRecorderRef.current.resume();
    setIsRecording(true);
  };

  const cancelRecording = () => {
    stopTimer();
    setDecimas(0);
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setActivateMicro(false);
  };

  const currentTimer = () => {
    const segundos = decimas / 10;
    const currentMin = Math.floor(segundos / 60);
    const currentSec = Math.floor(segundos - currentMin * 60)
      .toString()
      .padStart(2, "0");

    setRecordingTime(`${currentMin}:${currentSec}`);

    if (segundos >= 120.3) {
      stopRecording();
    }
  };

  return (
    <AudioContext.Provider
      value={{
        activateMicro,
        setActivateMicro,
        isRecording,
        setIsRecording,
        decimas,
        mediaRecorderRef,
        newAudio,
        setNewAudio,
        recordingTime,
        currentTimer,
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        cancelRecording,
        justOnePlayer,
        setJustOnePlayer,
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
