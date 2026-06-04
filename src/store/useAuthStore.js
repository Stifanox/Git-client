import { create } from 'zustand';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase.js';

const FIREBASE_ERROR_MESSAGES = {
    'auth/invalid-email': 'Nieprawidłowy adres e-mail.',
    'auth/user-disabled': 'To konto zostało wyłączone.',
    'auth/user-not-found': 'Nie znaleziono użytkownika o podanym adresie e-mail.',
    'auth/wrong-password': 'Nieprawidłowe hasło.',
    'auth/invalid-credential': 'Nieprawidłowy e-mail lub hasło.',
    'auth/too-many-requests': 'Zbyt wiele prób logowania. Spróbuj ponownie później.',
    'auth/network-request-failed': 'Błąd sieci. Sprawdź połączenie z internetem.',
};

function mapAuthError(error) {
    return FIREBASE_ERROR_MESSAGES[error?.code] ?? error?.message ?? 'Logowanie nie powiodło się.';
}

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    submitting: false,
    error: null,

    init: () => {
        if (!auth) {
            set({ user: null, loading: false });
            return () => {};
        }

        return onAuthStateChanged(auth, (user) => {
            set({ user, loading: false, error: null });
        });
    },

    login: async (email, password) => {
        if (!auth) {
            const message = 'Firebase nie jest skonfigurowany. Uzupełnij plik .env (patrz .env.example).';
            set({ error: message });
            throw new Error(message);
        }

        set({ submitting: true, error: null });
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
            set({ submitting: false });
        } catch (err) {
            const message = mapAuthError(err);
            set({ error: message, submitting: false });
            throw err;
        }
    },

    logout: async () => {
        if (!auth) return;
        set({ error: null });
        await signOut(auth);
    },

    clearError: () => set({ error: null }),
}));
