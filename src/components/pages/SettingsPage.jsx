import { RefreshCw, Download } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useSettingsStore } from '../../store/useSettingsStore.js';
import {
    AppearanceFields,
    GitConfigFields,
    RepositoryPathsFields,
    UserProfileFields,
} from '../settings/SettingsFields.jsx';

export default function SettingsPage() {
    const user = useAuthStore((s) => s.user);
    const uid = user?.uid;
    const {
        fullName, email, onyxTheme, fontSize, defaultBranch,
        gpgSigning, repositoryPaths, updateField, addRepositoryPath,
        removeRepositoryPath, saving, profileError,
    } = useSettingsStore();

    return (
        <div className="flex-1 flex flex-col overflow-y-auto bg-surface h-screen selection:bg-primary/20">
            <header className="flex items-center justify-between px-12 py-8 shrink-0">
                <div className="flex items-baseline gap-8">
                    <h2 className="text-[24px] font-extrabold text-on-surface tracking-editorial font-display">Settings</h2>
                    <div className="flex gap-6 text-[13.5px] font-semibold font-body">
                        <button type="button" className="text-on-surface border-b-2 border-primary pb-1.5">Global</button>
                        <button type="button" className="text-on-surface-variant hover:text-on-surface pb-1.5 transition-colors">Project</button>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    {saving && (
                        <span className="text-[12px] text-on-surface-variant font-body">Saving…</span>
                    )}
                    <button type="button" className="text-on-surface-variant hover:text-on-surface transition-colors">
                        <RefreshCw className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button type="button" className="text-on-surface-variant hover:text-on-surface transition-colors mr-2">
                        <Download className="w-4 h-4" strokeWidth={2} />
                    </button>
                    <button type="button" className="bg-primary hover:opacity-90 text-surface px-4 py-2 rounded-md font-bold text-[13.5px] transition-all font-body shadow-ambient">
                        Commit Changes
                    </button>
                </div>
            </header>

            {profileError && (
                <p className="mx-12 mb-4 rounded-md bg-tertiary/10 px-4 py-3 text-[13px] text-tertiary font-body" role="alert">
                    {profileError}
                </p>
            )}

            <div className="px-12 py-6 max-w-5xl space-y-16 pb-16">
                <UserProfileFields
                    fullName={fullName}
                    email={email}
                    onFullNameChange={(v) => updateField('fullName', v, uid)}
                    emailReadOnly
                />
                <AppearanceFields
                    onyxTheme={onyxTheme}
                    fontSize={fontSize}
                    onOnyxThemeChange={(v) => updateField('onyxTheme', v, uid)}
                    onFontSizeChange={(v) => updateField('fontSize', v, uid)}
                />
                <GitConfigFields
                    defaultBranch={defaultBranch}
                    gpgSigning={gpgSigning}
                    onDefaultBranchChange={(v) => updateField('defaultBranch', v, uid)}
                    onGpgSigningChange={(v) => updateField('gpgSigning', v, uid)}
                />
                <RepositoryPathsFields
                    repositoryPaths={repositoryPaths}
                    onAddPath={(path) => addRepositoryPath(path, uid)}
                    onRemovePath={(path) => removeRepositoryPath(path, uid)}
                />
            </div>
        </div>
    );
}
