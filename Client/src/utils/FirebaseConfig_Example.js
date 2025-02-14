import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    projectId: "<PROJECT_ID>",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<MESSAGING_SENDER_ID>",
    appId: "<APP_ID>"
  };
  const app = initializeApp(firebaseConfig);
  export const firebaseAuth = getAuth(app)