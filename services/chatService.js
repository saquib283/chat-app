// services/chatService.js
import { db } from './firebaseConfig';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
   
    doc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore';



export const sendMessage = async (chatId, message) => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
        ...message,
        createdAt: serverTimestamp(),
    });
};

export const subscribeToMessages = (chatId, callback) => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return onSnapshot(q, snapshot => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(msgs);
    });
};

export const createUserIfNotExists = async (user) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL || '',
        lastSeen: serverTimestamp(),
    }, { merge: true });
};
