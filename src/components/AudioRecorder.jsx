import { useAudioContext } from "../context/AudioContext";
import { MdDelete } from "react-icons/md";
import { IoPause } from "react-icons/io5";
import { RiSendPlaneFill } from "react-icons/ri";
import { HiMicrophone } from "react-icons/hi";
import { useEffect } from "react";

export default function AudioRecorder() {
  const {
    activateMicro,
    isRecording,
    recordingTime,
    centesimas,
    progressPercentage,
    setProgressPercentage,
    marginLeft,
    setMarginLeft,
    currentTimer,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
  } = useAudioContext();

  useEffect(() => {
    currentTimer();
    setProgressPercentage(((centesimas / 100) * 100) / 120);
  }, [centesimas]);

  useEffect(() => {
    const thumbWidth = 18;
    const centerThumb = (thumbWidth / 100) * progressPercentage * -1;

    setMarginLeft(centerThumb);
  }, [progressPercentage]);

  return (
    <div
      className={`flex items-center justify-end gap-5 w-full px-4 pb-4 transition duration-500 absolute top-0 ${
        !activateMicro && "opacity-0 translate-x-full"
      } `}
    >
      <button>
        <MdDelete className={`text-2xl`} onClick={cancelRecording} />
      </button>

      <span className="w-8 font-medium">{recordingTime}</span>

      <div className="flex grow max-w-xs">
        <div className="slider-container-record">
          <div
            style={{
              width: `calc((${progressPercentage}%) - ${
                0.011 * progressPercentage
              }%)`,
              marginLeft: "0.5%",
            }}
            className="progress-bar-cover-record"
          ></div>
          <div
            style={{
              left: `${progressPercentage}%`,
              marginLeft: `${marginLeft}px`,
            }}
            className="thumb-record"
          ></div>
        </div>
      </div>

      <button
        className={``}
        onClick={() => {
          if (isRecording) {
            pauseRecording();
          } else {
            resumeRecording();
          }
        }}
      >
        <HiMicrophone className={`text-2xl ${isRecording && "hidden"}`} />
        <IoPause className={`text-2xl ${!isRecording && "hidden"}`} />
      </button>

      <button
        className={`bg-cyan-500 rounded-lg px-2 py-1 `}
        onClick={() => {
          stopRecording();
        }}
      >
        <RiSendPlaneFill size={30} color={"#fff"} />
      </button>
    </div>
  );
}
