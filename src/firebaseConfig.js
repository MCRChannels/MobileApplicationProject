import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyB63xmSWDuCgyIeJ7_1w6PTo41Bn8ZOM4k",
    authDomain: "studyapp-29d48.firebaseapp.com",
    projectId: "studyapp-29d48",
    storageBucket: "studyapp-29d48.firebasestorage.app",
    messagingSenderId: "789158763205",
    appId: "1:789158763205:web:73efab186355c5fba5aeac",
    measurementId: "G-8T47397FBL"
};

const app = initializeApp(firebaseConfig);

let auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
} catch (e) {
    auth = getAuth(app);
}
const db = getFirestore(app);

export { app, auth, db };
