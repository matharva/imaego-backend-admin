import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";

// console.log(process.env.REACT_APP_FIREBASE_API_KEY);

// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// });

const app = firebase.initializeApp({
  apiKey: "AIzaSyC8pGY3D07zP2panWUJFrTAWgE9QghxC54",
  authDomain: "auth-react-f227d.firebaseapp.com",
  projectId: "auth-react-f227d",
  storageBucket: "auth-react-f227d.appspot.com",
  messagingSenderId: "611248070530",
  appId: "1:611248070530:web:9e2801b3f3e5b471b6399b",
});

export const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export const auth = app.auth();
export const projectStorage = firebase.storage();
export const projectFirestore = firebase.firestore();

export default app;
