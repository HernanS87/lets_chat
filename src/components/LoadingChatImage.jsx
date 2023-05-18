import { HashLoader } from "react-spinners";

export default function LoadingChatImage() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-40 bg-black bg-opacity-40 flex justify-center items-center">
      <HashLoader size={60} color={"#36d7b7"} />
    </div>
  );
}
