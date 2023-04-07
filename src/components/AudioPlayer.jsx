import { useEffect, useRef, useState } from "react";
import { IoPlay, IoPause } from "react-icons/io5";
import { useAudioContext } from "../context/AudioContext";

export default function AudioPlayer({ urlStream, duration, id }) {
  const audio = useRef(null);
  const { justOnePlayer, setJustOnePlayer } = useAudioContext();
  const [progress, setProgress] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [marginLeft, setMarginLeft] = useState(0);
  const [timer, setTimer] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [activateTimer, setActivateTimer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);

  const getTimer = (e) => {
    const totalMin = Math.floor(duration / 60);
    const totalSec = Math.floor(duration - totalMin * 60)
      .toString()
      .padStart(2, "0");
    const currentMin = Math.floor(e.target.currentTime / 60);
    const currentSec = Math.floor(e.target.currentTime - currentMin * 60)
      .toString()
      .padStart(2, "0");

    setTimer(`${currentMin}:${currentSec}`);
    setTotalTime(`${totalMin}:${totalSec}`);
  };

  useEffect(() => {
    const thumbWidth = 18;
    const centerThumb = (thumbWidth / 100) * progressPercentage * -1;

    setMarginLeft(centerThumb);
  }, [progressPercentage]);

  useEffect(() => {
    if (justOnePlayer !== id) {
      audio.current.pause();
      setIsPlaying(false);
      setActivateTimer(false)
    }
  }, [justOnePlayer]);

  return (
    <div className=" m-1">
      <div className="relative w-64 flex gap-5 py-3 pl-4 pr-4 text-white rounded-full select-none bg-slate-900">
        <audio
          ref={audio}
          src={urlStream}
          onLoadedData={(e) => {
            getTimer(e);
          }}
          onTimeUpdate={(e) => {
            // console.log(e.target.currentTime)
            setProgress(e.target.currentTime);
            setProgressPercentage((e.target.currentTime * 100) / duration);
            getTimer(e);
          }}
          onEnded={() => {
            setProgress(0);
            setProgressPercentage(0);
            setIsPlaying(false);
          }}
        />
        <div className="absolute text-xs font-semibold text-gray-400 bottom-1 timer left-18">
          <p>{activateTimer ? timer : totalTime}</p>
        </div>
        <button
          onClick={() => {
            if (!isPlaying) {
              setJustOnePlayer(id);
              audio.current.play();
              setIsPlaying(true);
              setActivateTimer(true);
            } else {
              audio.current.pause();
              setIsPlaying(false);
              setActivateTimer(false);
            }
          }}
        >
          <IoPlay
            className={`text-4xl text-cyan-500 ${isPlaying && "hidden"}`}
          />
          <IoPause
            className={`text-4xl text-cyan-500 ${!isPlaying && "hidden"}`}
          />
        </button>
        <div className="slider-container">
          <div
            style={{
              width: `calc((${progressPercentage}%) - ${
                0.011 * progressPercentage
              }%)`,
              marginLeft: "0.5%",
            }}
            className="progress-bar-cover"
          ></div>
          <div
            style={{
              left: `${progressPercentage}%`,
              marginLeft: `${marginLeft}px`,
            }}
            className="thumb"
          ></div>
          <input
            type="range"
            className="range"
            value={progress}
            min={0}
            step={0.0001}
            max={duration}
            onInput={(e) => {
              // CON ESTO ADELANTO O RETROCEDO LA CANCION
              audio.current.currentTime = e.target.value;
            }}
            onMouseDown={() => {
              if (isPlaying) {
                audio.current.pause();
                setIsPlaying(false);
                setWasPlaying(true);
              } else {
                setWasPlaying(false);
              }
              setActivateTimer(true);
            }}
            onMouseUp={() => {
              if (wasPlaying) {
                audio.current.play();
                setIsPlaying(true);
              } else {
                setActivateTimer(false);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
