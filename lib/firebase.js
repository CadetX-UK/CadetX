import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfmSbd5zhoHpsqSkBlotv0VPHY65bUqbY",
    authDomain: "dadbot-df0ef.firebaseapp.com",
    projectId: "dadbot-df0ef",
    storageBucket: "dadbot-df0ef.firebasestorage.app",
    messagingSenderId: "846801052836",
    appId: "1:846801052836:web:4ed6b7fccfa0b5496db231",
    measurementId: "G-B136JJT0TL"
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth
const auth = getAuth(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export { auth, googleProvider, app };
