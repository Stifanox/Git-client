import { create } from 'zustand';
import { db } from '../services/firebase.js';
import {
    createEmptyProfile,
    createUserProfile,
    fetchUserProfile,
    pickProfileFields,
    updateUserProfile,
} from '../services/userProfile.js';

let saveTimer = null;
let loadGeneration = 0;

function setMissingProfile(set, authEmail, profileError = null) {
    set({
        ...createEmptyProfile(authEmail),
        email: authEmail ?? '',
        profileStatus: 'missing',
        profileError,
    });
}

export const useSettingsStore = create((set, get) => ({
    ...createEmptyProfile(),
    profileStatus: 'idle',
    profileError: null,
    saving: false,

    applyProfile: (profile) => set({ ...createEmptyProfile(), ...pickProfileFields(profile) }),

    resetProfile: () => {
        loadGeneration += 1;
        set({
            ...createEmptyProfile(),
            profileStatus: 'idle',
            profileError: null,
            saving: false,
        });
    },

    loadProfile: async (uid, authEmail) => {
        const generation = ++loadGeneration;
        set({ profileStatus: 'loading', profileError: null });

        if (!db) {
            if (generation !== loadGeneration) return;
            setMissingProfile(
                set,
                authEmail,
                'Firestore nie jest dostępny. Sprawdź plik .env i utwórz bazę w Firebase Console.',
            );
            return;
        }

        try {
            const remote = await fetchUserProfile(uid);
            if (generation !== loadGeneration) return;

            if (remote) {
                set({
                    ...createEmptyProfile(),
                    ...remote,
                    email: authEmail || remote.email,
                    profileStatus: 'ready',
                    profileError: null,
                });
            } else {
                setMissingProfile(set, authEmail);
            }
        } catch (err) {
            if (generation !== loadGeneration) return;
            setMissingProfile(set, authEmail, err?.message ?? 'Nie udało się wczytać profilu.');
        }
    },

    completeOnboarding: async (uid, authEmail) => {
        const email = authEmail ?? get().email;
        set({ email, saving: true, profileError: null });
        try {
            const profile = { ...pickProfileFields(get()), email };
            await createUserProfile(uid, profile);
            set({ profileStatus: 'ready', saving: false, profileError: null });
        } catch (err) {
            set({
                saving: false,
                profileError: err?.message ?? 'Nie udało się zapisać profilu.',
            });
            throw err;
        }
    },

    saveProfile: async (uid) => {
        if (get().profileStatus !== 'ready') return;
        set({ saving: true, profileError: null });
        try {
            await updateUserProfile(uid, pickProfileFields(get()));
            set({ saving: false, profileError: null });
        } catch (err) {
            set({
                saving: false,
                profileError: err?.message ?? 'Nie udało się zapisać zmian.',
            });
        }
    },

    queueProfileSave: (uid) => {
        if (!uid || get().profileStatus !== 'ready') return;
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            get().saveProfile(uid);
        }, 600);
    },

    updateField: (field, value, uid) => {
        set({ [field]: value });
        get().queueProfileSave(uid);
    },

    addRepositoryPath: (path, uid) => {
        set((state) => ({ repositoryPaths: [...state.repositoryPaths, path] }));
        get().queueProfileSave(uid);
    },

    removeRepositoryPath: (path, uid) => {
        set((state) => ({
            repositoryPaths: state.repositoryPaths.filter((p) => p !== path),
        }));
        get().queueProfileSave(uid);
    },
}));
