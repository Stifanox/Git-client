import { useNavigate } from 'react-router-dom';
import { GitBranch, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';
import { isFirebaseConfigured } from '../../services/firebase.js';
import {
    AppearanceFields,
    GitConfigFields,
    RepositoryPathsFields,
    UserProfileFields,
} from '../settings/SettingsFields.jsx';

export default function OnboardingPage() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const {
        fullName, email, onyxTheme, fontSize, defaultBranch, gpgSigning, repositoryPaths,
        saving, profileError, updateField, addRepositoryPath, removeRepositoryPath, completeOnboarding,
    } = useSettingsStore();

    const uid = user?.uid;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!uid || !fullName.trim()) return;
        try {
            await completeOnboarding(uid, user.email ?? email);
            navigate('/settings', { replace: true });
        } catch {
            // error in store
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col overflow-y-auto bg-surface selection:bg-primary/20">
            <header className="shrink-0 px-12 py-10 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-low shadow-ambient">
                    <GitBranch className="h-6 w-6 text-primary" strokeWidth={1.75} />
                </div>
                <h1 className="text-[26px] font-extrabold tracking-editorial text-on-surface font-display">
                    Welcome to The Monolithic
                </h1>
                <p className="mt-2 max-w-lg mx-auto text-[14px] text-on-surface-variant font-body">
                    Skonfiguruj swój profil Git i preferencje aplikacji. Te ustawienia zapisujemy w chmurze i możesz je
                    później edytować w Settings.
                </p>
            </header>

            {!isFirebaseConfigured && (
                <p className="mx-auto mb-6 max-w-2xl rounded-md bg-tertiary/10 px-4 py-3 text-[13px] text-tertiary font-body">
                    Brak konfiguracji Firebase — uzupełnij plik `.env` i włącz Firestore w konsoli.
                </p>
            )}

            <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl px-12 pb-16 space-y-16">
                <UserProfileFields
                    fullName={fullName}
                    email={email}
                    onFullNameChange={(v) => updateField('fullName', v)}
                    emailReadOnly
                />
                <AppearanceFields
                    onyxTheme={onyxTheme}
                    fontSize={fontSize}
                    onOnyxThemeChange={(v) => updateField('onyxTheme', v)}
                    onFontSizeChange={(v) => updateField('fontSize', v)}
                />
                <GitConfigFields
                    defaultBranch={defaultBranch}
                    gpgSigning={gpgSigning}
                    onDefaultBranchChange={(v) => updateField('defaultBranch', v)}
                    onGpgSigningChange={(v) => updateField('gpgSigning', v)}
                />
                <RepositoryPathsFields
                    repositoryPaths={repositoryPaths}
                    onAddPath={(path) => addRepositoryPath(path)}
                    onRemovePath={(path) => removeRepositoryPath(path)}
                />

                {profileError && (
                    <p className="rounded-md bg-tertiary/10 px-4 py-3 text-[13px] text-tertiary font-body" role="alert">
                        {profileError}
                    </p>
                )}

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving || !fullName.trim()}
                        className="flex items-center gap-2 rounded-md bg-primary px-6 py-2.5 text-[13.5px] font-bold text-surface transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 font-body shadow-ambient"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                                Saving…
                            </>
                        ) : (
                            'Complete Setup'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
