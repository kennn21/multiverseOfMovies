// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnksloExMNxlmuEH9V4i5Cvc5uTKeyZ9M",
  authDomain: "multiverse-of-movies-db239.firebaseapp.com",
  projectId: "multiverse-of-movies-db239",
  storageBucket: "multiverse-of-movies-db239.appspot.com",
  messagingSenderId: "233007359802",
  appId: "1:233007359802:web:732aeed3e72f87b1bc5203",
  measurementId: "G-QXD9V0QFPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, analytics, storage };   