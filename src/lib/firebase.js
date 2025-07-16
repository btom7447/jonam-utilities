import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcLDil3sSQAqx6FI-eDJROtgYuV7AaV_k",
  authDomain: "jonam-utilities.firebaseapp.com",
  projectId: "jonam-utilities",
  storageBucket: "jonam-utilities.firebasestorage.app",
  messagingSenderId: "1001368904584",
  appId: "1:1001368904584:web:83697b52174ba35f5d103d",
  measurementId: "G-BQCDCTLLDJ"
};

// Initialize app once
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Auth & provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Session check
export function getUserSession() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({
          isLoggedIn: true,
          user: {
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photo: user.photoURL,
          },
        });
      } else {
        resolve({ isLoggedIn: false, user: null });
      }
    });
  });
}

// Auth actions
export function registerWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export function logout() {
  return signOut(auth);
}

export { auth, googleProvider };
