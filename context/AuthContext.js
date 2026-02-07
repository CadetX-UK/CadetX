'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithRedirect,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Handle redirect result on page load
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    setUser(result.user);
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Redirect error:', error);
                setError(error.message);
            }
        };

        handleRedirectResult();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const signInWithGoogle = async () => {
        try {
            setError(null);
            await signInWithRedirect(auth, googleProvider);
            // The redirect will happen, so no return value needed
        } catch (error) {
            console.error('Google sign-in error:', error);
            setError(error.message);
            return { user: null, error: error.message };
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
            setError(null);
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { user: result.user, error: null };
        } catch (error) {
            console.error('Email sign-in error:', error);
            setError(error.message);
            return { user: null, error: error.message };
        }
    };

    const signUpWithEmail = async (email, password) => {
        try {
            setError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return { user: result.user, error: null };
        } catch (error) {
            console.error('Email sign-up error:', error);
            setError(error.message);
            return { user: null, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setError(null);
            return { error: null };
        } catch (error) {
            console.error('Logout error:', error);
            setError(error.message);
            return { error: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            signInWithGoogle,
            signInWithEmail,
            signUpWithEmail,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
