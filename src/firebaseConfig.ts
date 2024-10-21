// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGEING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyAZl14q-pl27I10j1uBy37WECh7zdeE9vk",
  authDomain: "whisperme-65c88.firebaseapp.com",
  projectId: "whisperme-65c88",
  storageBucket: "whisperme-65c88.appspot.com",
  messagingSenderId: "323108310476",
  appId: "1:323108310476:web:eea539693a75370d5d6169",
  measurementId: "G-7BTTMZ6MX7"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
