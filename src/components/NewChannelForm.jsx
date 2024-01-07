import { IoMdArrowRoundBack, IoMdCamera } from "react-icons/io";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import sinImagen from "../assets/sinImagen.jpg";
import { useState } from "react";
import EmojisPicker from "./EmojisPicker";
import ChannelImagePopup from "./ChannelImagePopup";

export default function NewChannelForm() {
  const {
    setNewChannel,
    uploadFile,
    channelImage,
    setChannelImage,
    setTempChannelImage,
    channelNameForm,
    setChannelNameForm,
    handleChannelForm,
    setEditActiveChannel,
    showEmojiPickerChannel,
    setShowEmojiPickerChannel,
    listOfComponentsToClose,
    setListOfComponentsToClose,
  } = useChatContext();

  const [channelPopup, setChannelPopup] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [wannaChangeImage, setWannaChangeImage] = useState(false);

  const addEmoji = (data) => {
    setChannelNameForm(channelNameForm + data.emoji);
  };

  const handleChange = async (e) => {
    setChannelPopup(true);
    setLoadingImage(true);
    if (!e.target.files[0].type.includes("image")) {
      e.target.value = null;
      setLoadingImage(false);
      return toast.error("Solo puedes subir imágenes!", {
        position: "top-center",
        autoClose: 2500,
      });
    }
    try {
      const result = await uploadFile(e.target.files[0]);
      setTempChannelImage(result);
    } catch (error) {
      toast.error("Ha ocurrido un error, inténtalo mas tarde", {
        position: "top-center",
        autoClose: 2500,
      });
    } finally {
      e.target.value = null;
      setLoadingImage(false);
    }
  };

  // ESTE COMPONENTE SE CERRABA SOLO CON ESC

  return (
    <form
      className="flex flex-col z-20 gap-10 text-lg items-center h-screen w-1/3 bg-slate-850"
      onClick={(e) => {
        e.stopPropagation();
        setShowEmojiPickerChannel(false);
        setListOfComponentsToClose(
          listOfComponentsToClose.filter(
            (component) => component != "EmojisPickerChannel"
          )
        );
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="w-full flex items-center px-3 py-2 gap-5 h-14 ">
        <IoMdArrowRoundBack
          color={"#06B6D4"}
          className="cursor-pointer text-3xl"
          onClick={(e) => {
            e.stopPropagation();
            setChannelImage(null);
            setNewChannel(false);
            setListOfComponentsToClose(
              listOfComponentsToClose.filter(
                (component) =>
                  component != "NewChannelForm" &&
                  component != "EmojisPickerChannel"
              )
            );
            setShowEmojiPickerChannel(false);
            setChannelNameForm("");
            setEditActiveChannel(false);
          }}
        />
        <span className="text-xl">Nuevo Canal</span>
      </div>
      <label
        htmlFor="newImage"
        className="cursor-pointer rounded-full"
        onMouseOver={() => setWannaChangeImage(true)}
        onMouseLeave={() => setWannaChangeImage(false)}
      >
        <div className="relative flex items-center justify-center rounded-full ">
          {!channelImage && (
            <div className="absolute flex flex-col items-center gap-0 justify-center">
              <IoMdCamera className="text-2xl" />
              <span className="text-sm">AÑADIR IMAGEN</span>
            </div>
          )}
          {wannaChangeImage && channelImage && (
            <div className="absolute flex flex-col items-center gap-0 justify-center bg-black bg-opacity-60 w-full h-full rounded-full">
              <IoMdCamera className="text-2xl" />
              <span className="text-sm">CAMBIAR IMAGEN</span>
            </div>
          )}
          <img
            src={channelImage ? channelImage : sinImagen}
            alt=""
            className={`w-40 aspect-square object-cover rounded-full ${
              !channelImage && "opacity-30"
            } `}
          />
          <input
            type="file"
            className="hidden"
            id="newImage"
            // multiple
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      </label>
      {channelPopup && (
        <ChannelImagePopup
          setChannelPopup={setChannelPopup}
          handleChange={handleChange}
          loadingImage={loadingImage}
        />
      )}
      <div className="w-52 mt-6 relative flex items-center border-b border-cyan-500 ">
        <input
          type="text"
          placeholder="Nombre"
          value={channelNameForm}
          maxLength={24}
          className="bg-transparent text-sm w-full py-1 outline-none"
          onChange={(e) => setChannelNameForm(e.target.value)}
        />
        <MdOutlineEmojiEmotions
          className="cursor-pointer mx-1"
          size={30}
          onClick={(e) => {
            e.stopPropagation();
            setShowEmojiPickerChannel(!showEmojiPickerChannel);
            setListOfComponentsToClose([
              ...listOfComponentsToClose,
              "EmojisPickerChannel",
            ]);
          }}
        />
        {showEmojiPickerChannel && (
          <EmojisPicker
            addEmoji={addEmoji}
            setShowPicker={setShowEmojiPickerChannel}
            newChannelForm={true}
            whichPicker={"EmojisPickerChannel"}
          />
        )}
      </div>
      <div onClick={handleChannelForm}>
        <IoCheckmarkSharp className="mt-10 text-2xl w-10 h-10 p-2 rounded-full bg-cyan-500 hover:opacity-90 cursor-pointer" />
      </div>
    </form>
  );
}
