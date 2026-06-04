import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase.js';

const COLLECTION = 'users';
const FETCH_TIMEOUT_MS = 10_000;

export const PROFILE_FIELDS = [
    'fullName',
    'email',
    'onyxTheme',
    'fontSize',
    'defaultBranch',
    'gpgSigning',
    'repositoryPaths',
];

export function pickProfileFields(data) {
    return Object.fromEntries(PROFILE_FIELDS.map((key) => [key, data[key]]));
}

export function createEmptyProfile(authEmail = '') {
    return {
        fullName: '',
        email: authEmail,
        onyxTheme: true,
        fontSize: 'Medium',
        defaultBranch: 'main',
        gpgSigning: false,
        repositoryPaths: [],
    };
}

function userRef(uid) {
    return doc(db, COLLECTION, uid);
}

function withTimeout(promise, ms = FETCH_TIMEOUT_MS) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Przekroczono czas oczekiwania na Firestore.')), ms);
        }),
    ]);
}

export function mapFirestoreError(error) {
    const code = error?.code ?? '';
    const message = error?.message ?? '';

    if (message.includes("Database") && message.includes('not found')) {
        return 'Baza Firestore nie została utworzona. W Firebase Console: Build → Firestore Database → Create database (wybierz tryb testowy).';
    }
    if (code === 'permission-denied') {
        return 'Brak uprawnień do Firestore. Sprawdź reguły bezpieczeństwa w Firebase Console.';
    }
    if (code === 'unavailable' || code === 'deadline-exceeded') {
        return 'Firestore jest niedostępny. Sprawdź połączenie i konfigurację projektu.';
    }

    return message || 'Nie udało się połączyć z Firestore.';
}

export async function fetchUserProfile(uid) {
    if (!db) return null;

    try {
        const snapshot = await withTimeout(getDoc(userRef(uid)));
        if (!snapshot.exists()) return null;
        return pickProfileFields(snapshot.data());
    } catch (error) {
        throw new Error(mapFirestoreError(error));
    }
}

export async function createUserProfile(uid, profile) {
    if (!db) throw new Error('Firestore nie jest skonfigurowany.');
    try {
        await setDoc(userRef(uid), {
            ...pickProfileFields(profile),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            onboardingCompletedAt: serverTimestamp(),
        });
    } catch (error) {
        throw new Error(mapFirestoreError(error));
    }
}

export async function updateUserProfile(uid, profile) {
    if (!db) throw new Error('Firestore nie jest skonfigurowany.');
    try {
        await updateDoc(userRef(uid), {
            ...pickProfileFields(profile),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        throw new Error(mapFirestoreError(error));
    }
}
