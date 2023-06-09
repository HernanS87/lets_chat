import { createContext, useContext, useState, useRef } from "react";
import { useChatContext } from "./ChatContext";

const AudioContext = createContext();

export const AudioContextProvider = ({ children }) => {
  const { handleMessage, uploadFile } = useChatContext();

  const [activateMicro, setActivateMicro] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [newAudio, setNewAudio] = useState(null);

  const [decimas, setDecimas] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef(null);

  const [justOnePlayer, setJustOnePlayer] = useState(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setDecimas((decimas) => decimas + 1);
    }, 100);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
  };

  const checkMicrophonePermission = async () => {
    let permission;
    try {
      console.log("pidiendo permiso");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microfono activado", stream);
      permission = true;
      // El micrófono está habilitado, puedes comenzar la grabación aquí
    } catch (error) {
      console.log("Error:", error);
      permission = false;
    }
    return permission;
  };

  const startRecording = async () => {
    const permission = await checkMicrophonePermission();
    if (permission) {
      setActivateMicro(true);
      setIsRecording(true);
      startTimer();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
    } else {
      console.log("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = async () => {
    setActivateMicro(false);
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    setDecimas(0);
    console.log("nuevo tiempo", decimas / 10 - 0.15);
    stopTimer();
    mediaRecorderRef.current.addEventListener("dataavailable", async (e) => {
      const audioBlob = e.data;
      const audioUrl = await uploadFile(audioBlob, "audio");
      console.log("url de storage", audioUrl);
      const metaAudio = {
        urlStream: audioUrl,
        duration: decimas / 10 - 0.15,
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
