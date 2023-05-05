import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <main className=" min-h-screen dark:bg-slate-800 dark:text-slate-200 bg-gray-100 transition-all ease-in-out">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer />
    </main>
  );
}

export default App;
