import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCIs7eJTMuNl0VuVeSPpfi2QXejhextF8o",
    authDomain: "my-gist-app-2ae3b.firebaseapp.com",
    projectId: "my-gist-app-2ae3b",
    storageBucket: "my-gist-app-2ae3b.firebasestorage.app",
    messagingSenderId: "838585373626",
    appId: "1:838585373626:web:2259244d2b002671598383",
    measurementId: "G-GTRN83D51K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
