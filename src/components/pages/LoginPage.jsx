import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GitBranch, Loader2 } from 'lucide-react';
import TextInput from '../ui/TextInput';
import { useAuthStore } from '../../store/useAuthStore.js';
import { isFirebaseConfigured } from '../../services/firebase.js';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, loading, submitting, error, login, clearError } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from ?? '/settings';

    if (!loading && user) {
        return <Navigate to={redirectTo} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        try {
            await login(email, password);
            navigate(redirectTo, { replace: true });
        } catch {
            // error stored in auth store
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-surface px-6 selection:bg-primary/20">
            <div className="w-full max-w-[420px]">
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-surface-container-low shadow-ambient">
                        <GitBranch className="h-7 w-7 text-primary" strokeWidth={1.75} />
                    </div>
                    <h1 className="text-[28px] font-extrabold tracking-editorial text-on-surface font-display">
                        The Monolithic
                    </h1>
                    <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body">
                        Sign in to continue
                    </p>
                </div>

                <div className="rounded-bento bg-surface-container-low p-8 shadow-ambient">
                    {!isFirebaseConfigured && (
                        <p className="mb-5 rounded-md bg-tertiary/10 px-4 py-3 text-[13px] leading-relaxed text-tertiary font-body">
                            Brak konfiguracji Firebase. Utwórz plik <code className="font-mono text-[12px]">.env</code> na
                            podstawie <code className="font-mono text-[12px]">.env.example</code> i uruchom ponownie serwer deweloperski.
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <TextInput
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={setEmail}
                            disabled={submitting}
                        />
                        <TextInput
                            label="Password"
                            type="password"
                            value={password}
                            onChange={setPassword}
                            disabled={submitting}
                        />

                        {error && (
                            <p className="rounded-md bg-tertiary/10 px-4 py-3 text-[13px] text-tertiary font-body" role="alert">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting || !email || !password}
                            className="mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-[13.5px] font-bold text-surface transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 font-body shadow-ambient"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                                    Signing in…
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-[12px] text-on-surface-variant font-body">
                    Local Git Client — simulated repository state in memory.
                </p>
            </div>
        </div>
    );
}
