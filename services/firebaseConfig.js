// services/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth,getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyABbTcJeXe6CKq9_UUu9wednJnWpiw1N9w",
    authDomain: "chat-app-dbaf0.firebaseapp.com",
    projectId: "chat-app-dbaf0",
    storageBucket: "chat-app-dbaf0.firebasestorage.app",
    messagingSenderId: "278801225969",
    appId: "1:278801225969:web:f8bff6b4115f2ea2ea3150",
    measurementId: "G-0GPXMM614B"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { auth, db };
