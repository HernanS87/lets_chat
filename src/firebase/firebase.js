// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
// 	apiKey: 'AIzaSyDWAfbjsR-CIVfyyVAh3VblC-nEPbKf_G0',
// 	authDomain: 'firestore-realtime-chat-react.firebaseapp.com',
// 	projectId: 'firestore-realtime-chat-react',
// 	storageBucket: 'firestore-realtime-chat-react.appspot.com',
// 	messagingSenderId: '696118136133',
// 	appId: '1:696118136133:web:5b8a7b0dcd4a721f72022c',
// };
const firebaseConfig = {
  apiKey: "AIzaSyBijCv6Py-n5Z4cfYSITeMwz3EgOfnYyKE",
  authDomain: "lets-chat-8.firebaseapp.com",
  projectId: "lets-chat-8",
  storageBucket: "lets-chat-8.appspot.com",
  messagingSenderId: "1080959886944",
  appId: "1:1080959886944:web:aadb2e3ae235d462a24505",
  measurementId: "G-LCCM9RKXW3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage(app);
