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
  apiKey: "AIzaSyAjUBjzUARBI2GtQMj-2Jx0FWgm2BK98iA",
  authDomain: "dev-lovyu.firebaseapp.com",
  projectId: "dev-lovyu",
  storageBucket: "dev-lovyu.firebasestorage.app",
  messagingSenderId: "992940157334",
  appId: "1:992940157334:web:3a04403a96690acebf55b7",
  measurementId: "G-DL2EDD3SG7"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
