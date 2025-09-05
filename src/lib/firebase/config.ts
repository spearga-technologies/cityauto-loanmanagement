
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBm6Rx0L2AZtvWo2gmb-QUfXbdY6iGiuxI",
    authDomain: "cityauto-36853.firebaseapp.com",
    projectId: "cityauto-36853",
    storageBucket: "cityauto-36853.appspot.com",
    messagingSenderId: "1000388166027",
    appId: "1:1000388166027:web:652102f50d7d892f312f8e",
    measurementId: "G-8E7TGXXD2M"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
