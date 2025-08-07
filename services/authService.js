// // services/authService.js
// import { auth, db } from './firebaseConfig';
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     signOut,
// } from 'firebase/auth';
// import { collection, getDocs } from 'firebase/firestore';

// export const register = (email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);
// };

// export const login = (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
// };

// export const logout = () => {
//     return signOut(auth);
// };

// export const getCurrentUser = () => {
//     return auth.currentUser;
// };

// export const getAllUsers = async () => {
//     const usersSnapshot = await getDocs(collection(db, 'users'));
//     return usersSnapshot.docs.map(doc => doc.data());
// };

// export { auth }; // 🔥 Important to export this if you're using it in HomeScreen






// services/authService.js
import { auth, db } from './firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

export const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
    return signOut(auth);
};




export const getCurrentUser = () => {
    return auth.currentUser;
};

export const getAllUsers = async () => {
    try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        return usersSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
    } catch (error) {
        console.error("Error fetching all users:", error);
        return [];
    }
};

export { auth };