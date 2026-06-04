import { useState } from 'react';
import { Folder, Lock, RefreshCw, Download, Plus, Trash2 } from 'lucide-react'; // Dodany Trash2
import TextInput from '../ui/TextInput';
import Toggle from '../ui/Toggle';
import SettingsSection from '../layout/SettingsSection';
import Modal from '../ui/Modal';
import { useSettingsStore } from "../../store/useSettingsStore.js";

export default function SettingsPage() {
    const {
        fullName, email, onyxTheme, fontSize, defaultBranch,
        gpgSigning, repositoryPaths, updateField, addRepositoryPath,
        removeRepositoryPath // Pobranie nowej akcji ze Store'a
    } = useSettingsStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPathInput, setNewPathInput] = useState('');

    const handleAddPathSubmit = () => {
        if (newPathInput.trim() !== '') {
            addRepositoryPath(newPathInput.trim());
            setNewPathInput('');
            setIsModalOpen(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto bg-surface h-screen selection:bg-primary/20">

            {/* --- Modal --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Repository Path">
                <div className="flex flex-col gap-5">
                    <TextInput label="Local System Path" value={newPathInput} onChange={setNewPathInput} />
                    <div className="flex justify-end gap-3 mt-2">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-[13px] font-bold text-on-surface-variant hover:text-on-surface transition-colors font-body">
                            Cancel
                        </button>
                        <button onClick={handleAddPathSubmit} className="bg-primary hover:opacity-90 text-surface px-4 py-2 rounded-md font-bold text-[13px] transition-all font-body shadow-ambient">
                            Add Path
                        </button>
                    </div>
                </div>
            </Modal>

            {/* --- Header --- */}
            <header className="flex items-center justify-between px-12 py-8 shrink-0">
                <div className="flex items-baseline gap-8">
                    <h2 className="text-[24px] font-extrabold text-on-surface tracking-editorial font-display">Settings</h2>
                    <div className="flex gap-6 text-[13.5px] font-semibold font-body">
                        <button className="text-on-surface border-b-2 border-primary pb-1.5">Global</button>
                        <button className="text-on-surface-variant hover:text-on-surface pb-1.5 transition-colors">Project</button>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <button className="text-on-surface-variant hover:text-on-surface transition-colors"><RefreshCw className="w-4 h-4" strokeWidth={2} /></button>
                    <button className="text-on-surface-variant hover:text-on-surface transition-colors mr-2"><Download className="w-4 h-4" strokeWidth={2} /></button>
                    <button className="bg-primary hover:opacity-90 text-surface px-4 py-2 rounded-md font-bold text-[13.5px] transition-all font-body shadow-ambient">
                        Commit Changes
                    </button>
                </div>
            </header>

            {/* --- Form Content --- */}
            <div className="px-12 py-6 max-w-5xl space-y-16 pb-16">

                <SettingsSection title="User Profile" description="Identity used for your commit metadata across all repositories.">
                    <div className="flex gap-5">
                        <TextInput label="Full Name" value={fullName} onChange={(v) => updateField('fullName', v)} />
                        <TextInput label="Email Address" value={email} onChange={(v) => updateField('email', v)} />
                    </div>
                </SettingsSection>

                <SettingsSection title="Appearance" description="Customize the visual interface and editor experience.">
                    <div className="bg-surface-container-low rounded-bento p-6 flex flex-col gap-6 shadow-ambient">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-[14.5px] font-semibold text-on-surface font-body">Onyx Theme</h4>
                                <p className="text-[13px] text-on-surface-variant mt-0.5 font-body">High-contrast dark mode optimized for OLED.</p>
                            </div>
                            <Toggle enabled={onyxTheme} onChange={(v) => updateField('onyxTheme', v)} />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div>
                                <h4 className="text-[14.5px] font-semibold text-on-surface font-body">Monospace Font Size</h4>
                                <p className="text-[13px] text-on-surface-variant mt-0.5 font-body">Current: {fontSize} (Applies globally)</p>
                            </div>
                            <div className="flex bg-surface-container-lowest p-1 rounded-lg">
                                {['Small', 'Medium', 'Large'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => updateField('fontSize', size)}
                                        className={`px-4 py-1.5 rounded-md text-[12px] font-bold font-body transition-all ${
                                            fontSize === size ? 'bg-surface-container-high text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </SettingsSection>

                <SettingsSection title="Git Configuration" description="Low-level version control rules and protocols.">
                    <div className="relative">
                        <TextInput label="Default Branch Name" value={defaultBranch} onChange={(v) => updateField('defaultBranch', v)} />
                        <span className="absolute right-3 top-[35px] bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider font-body">
              Default
            </span>
                    </div>
                    <div className="flex items-center justify-between bg-surface-container-low border-l-[3px] border-primary p-5 rounded-r-bento rounded-l-sm shadow-ambient">
                        <div className="flex items-start gap-4">
                            <Lock className="w-[18px] h-[18px] text-primary mt-0.5" strokeWidth={2} />
                            <div>
                                <h4 className="text-[14.5px] font-semibold text-on-surface font-body">GPG Signing</h4>
                                <p className="text-[13px] text-on-surface-variant mt-0.5 font-body">Enable cryptographic signing for every commit. Requires local GPG key setup.</p>
                            </div>
                        </div>
                        <Toggle enabled={gpgSigning} onChange={(v) => updateField('gpgSigning', v)} />
                    </div>
                </SettingsSection>

                {/* --- ZAKTUALIZOWANA SEKCJA ŚCIEŻEK --- */}
                <SettingsSection title="Repository Paths" description="Define where your local repositories are scanned and stored.">
                    <div className="flex flex-col gap-3">
                        {repositoryPaths.map((path, idx) => (
                            /* Dodana klasa 'group' pozwala kontrolować widoczność przycisku usuwania */
                            <div
                                key={idx}
                                className="group flex items-center justify-between bg-surface-container-low px-4 py-3.5 rounded-xl text-[13px] font-mono text-on-surface shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <Folder className="w-[18px] h-[18px] text-on-surface-variant" strokeWidth={1.75} />
                                    {path}
                                </div>

                                {/* Przycisk usuwania: ukryty domyślnie (opacity-0), ujawnia się po hoverze na cały wiersz (group-hover:opacity-100) */}
                                <button
                                    onClick={() => removeRepositoryPath(path)}
                                    className="text-on-surface-variant hover:text-tertiary opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all p-1 cursor-pointer"
                                    title="Remove Path"
                                >
                                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border border-dashed border-surface-container-highest rounded-xl text-[13.5px] font-bold text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all hover:border-primary/40 font-body"
                        >
                            <Plus className="w-[18px] h-[18px]" strokeWidth={2} /> Add Scan Path
                        </button>
                    </div>
                </SettingsSection>

            </div>
        </div>
    );
}