import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, signOut } from 'firebase/auth';

// Firebase configuration
// IMPORTANT: Replace these with your own Firebase project credentials
// Get them from: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyBkEQ3yIYBXvuXCwmIFxbz8WyYNGtdzkfM",
  authDomain: "greetings-app-3a5d2.firebaseapp.com",
  projectId: "greetings-app-3a5d2",
  storageBucket: "greetings-app-3a5d2.firebasestorage.app",
  messagingSenderId: "833562437345",
  appId: "1:833562437345:web:07dd48d8b354eb23d1f9a0",
  measurementId: "G-PV8372EZQW"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      success: true,
      user: {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const signUpWithEmail = async (email, password, name) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: {
        uid: result.user.uid,
        name: name || email.split('@')[0],
        email: result.user.email,
        photo: null
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: {
        uid: result.user.uid,
        name: result.user.displayName || email.split('@')[0],
        email: result.user.email,
        photo: result.user.photoURL
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const signInAsGuest = async () => {
  try {
    const result = await signInAnonymously(auth);
    return {
      success: true,
      user: {
        uid: result.user.uid,
        name: 'Guest',
        email: 'guest@greetings.app',
        photo: null
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
