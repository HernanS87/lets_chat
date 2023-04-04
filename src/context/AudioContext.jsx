import { createContext, useContext, useState, useRef } from "react";
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

const AudioContext = createContext();

export const AudioContextProvider = ({ children }) => {
  const [activateMicro, setActivateMicro] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);

  const [centesimas, setCentesimas] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef(null);

  const [progressPercentage, setProgressPercentage] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);

  const uploadAudio = async (file) => {
    const storageRef = ref(storage, `audio/${v4()}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setCentesimas((centesimas) => centesimas + 1);
    }, 10);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const currentTimer = () => {
    const segundos = centesimas / 100;
    const currentMin = Math.floor(segundos / 60);
    const currentSec = Math.floor(segundos - currentMin * 60)
      .toString()
      .padStart(2, "0");

    setRecordingTime(`${currentMin}:${currentSec}`);

    if (segundos === 120.5) {
      stopRecording();
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

  const stopRecording = () => {
    setActivateMicro(false);
    setIsRecording(false);
    stopTimer();
    setCentesimas(0);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.addEventListener("dataavailable", async (e) => {
      const audioBlob = e.data;
      const audioUrl = await uploadAudio(audioBlob);
      console.log("url de storage", audioUrl);
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
