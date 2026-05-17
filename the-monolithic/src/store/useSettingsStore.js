import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
    persist(
        (set) => ({
            fullName: 'Alex Mercer',
            email: 'alex@monolithic.dev',
            onyxTheme: true,
            fontSize: 'Medium',
            defaultBranch: 'main',
            gpgSigning: false,
            repositoryPaths: ['~/Developer/Projects', '~/Work/Client-X'],

            updateField: (field, value) => set({ [field]: value }),

            addRepositoryPath: (path) => set((state) => ({
                repositoryPaths: [...state.repositoryPaths, path]
            })),

            // NOWA AKCJA: Usuwanie konkretnej ścieżki z tablicy
            removeRepositoryPath: (path) => set((state) => ({
                repositoryPaths: state.repositoryPaths.filter((p) => p !== path)
            })),
        }),
        {
            name: 'monolithic-settings',
        }
    )
);