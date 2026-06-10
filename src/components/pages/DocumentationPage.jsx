import { NavLink } from 'react-router-dom';
import {
    Database,
    List,
    GitBranch,
    History,
    GitMerge,
    ArrowRight,
    CircleDot,
} from 'lucide-react';

const WORKFLOW_STEPS = [
    {
        title: 'Przygotuj zmiany',
        body: 'W Staging stage\'uj pliki z unstaged, podejrzyj diff i wpisz commit message. Commit zapisuje się na bieżącej gałęzi (HEAD).',
        path: '/staging',
        label: 'Otwórz Staging',
    },
    {
        title: 'Zarządzaj gałęziami',
        body: 'W Branches przełączasz HEAD, tworzysz gałęzie, publikujesz (Push) lub ściągasz zmiany (Pull). Tip gałęzi aktualizuje się po każdym commicie.',
        path: '/branches',
        label: 'Otwórz Branches',
    },
    {
        title: 'Przeglądaj historię',
        body: 'History pokazuje commity wybranej gałęzi. Wyszukaj gałąź w toolbarze, filtruj commity i podejrzyj diff w panelu szczegółów.',
        path: '/history',
        label: 'Otwórz History',
    },
    {
        title: 'Rozwiąż konflikt',
        body: 'Push odrzuci publikację, gdy w Twoim nie wypchniętym commicie są pliki konfliktowe (App.jsx, Sidebar.jsx). Visual Merge Tool pozwala wybrać Ours/Theirs i zatwierdzić wynik.',
        path: '/merge',
        label: 'Otwórz Merge Tool',
    },
];

const VIEWS = [
    {
        icon: Database,
        name: 'Repositories',
        path: '/repositories',
        desc: 'Centrum repozytorium — historia commitów, status gałęzi (ahead/behind), Pull/Push i strumień aktywności.',
    },
    {
        icon: List,
        name: 'Staging',
        path: '/staging',
        desc: 'Obszar roboczy — stage/unstage, podgląd diffa, Commit oraz Commit & Push.',
    },
    {
        icon: GitBranch,
        name: 'Branches',
        path: '/branches',
        desc: 'Lista gałęzi lokalnych i zdalnych, checkout, publish, pull i menu kontekstowe (PPM).',
    },
    {
        icon: History,
        name: 'History',
        path: '/history',
        desc: 'Graf commitów bieżącej gałęzi z filtrowaniem i podglądem zmienionych plików.',
    },
    {
        icon: GitMerge,
        name: 'Merge Tool',
        path: '/merge',
        desc: 'Trójpanelowy resolver konfliktów — Local, Merged Result, Incoming.',
    },
];

const TERMINAL_COMMANDS = [
    { cmd: 'help', desc: 'Lista dostępnych komend' },
    { cmd: 'clear', desc: 'Czyści output terminala' },
    { cmd: 'exit', desc: 'Zamyka panel terminala' },
    { cmd: 'pwd / whoami / echo <tekst>', desc: 'Podstawowe stuby powłoki' },
    { cmd: 'git status', desc: 'Stan drzewa roboczego (zsynchronizowany ze Staging)' },
    { cmd: 'git branch', desc: 'Lista gałęzi lokalnych (* = HEAD)' },
    { cmd: 'git branch -a', desc: 'Gałęzie lokalne i zdalne' },
    { cmd: 'git branch <nazwa>', desc: 'Tworzy gałąź i przełącza na nią' },
    { cmd: 'git checkout <nazwa>', desc: 'Przełącza HEAD na gałąź' },
    { cmd: 'git add <ścieżka>', desc: 'Stage\'uje plik (jak + w Staging)' },
    { cmd: 'git reset HEAD <ścieżka>', desc: 'Unstage pliku' },
    { cmd: 'git commit -m "<wiadomość>"', desc: 'Commit staged plików na bieżącej gałęzi' },
    { cmd: 'git log --oneline -5', desc: 'Ostatnie commity bieżącej gałęzi' },
];

const TIPS = [
    'Symulator działa w pamięci — nie łączy się z prawdziwym Gitem ani systemem plików.',
    'Terminal otwierasz z sidebara (przycisk Terminal) — panel jest na dole bieżącego widoku, bez zmiany trasy.',
    'Konflikt push pojawia się tylko po commicie zawierającym src/App.jsx lub src/components/layout/Sidebar.jsx.',
    'Po Apply Merge powstaje merge commit, push się kończy i następuje przekierowanie do Repositories.',
    'Menu kontekstowe (PPM) działa na wierszach gałęzi w widoku Branches.',
];

export default function DocumentationPage() {
    return (
        <div className="flex-1 flex flex-col overflow-y-auto bg-surface h-screen selection:bg-primary/20">
            <header className="px-12 py-8 shrink-0">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-2">
                    Pomoc
                </p>
                <h2 className="text-[24px] font-extrabold text-on-surface tracking-editorial font-display">
                    Dokumentacja
                </h2>
                <p className="text-[14px] text-on-surface-variant font-body mt-3 max-w-2xl leading-relaxed">
                    Krótki przewodnik po The Monolithic — webowym kliencie Git z symulowanym repozytorium
                    w pamięci. Poniżej znajdziesz opis widoków i typowy przepływ pracy.
                </p>
            </header>

            <div className="px-12 pb-16 max-w-4xl space-y-10">
                <section className="bg-surface-container-low rounded-xl p-6">
                    <h3 className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-4">
                        Widoki
                    </h3>
                    <div className="space-y-3">
                        {VIEWS.map((view) => (
                            <NavLink
                                key={view.path}
                                to={view.path}
                                className="flex items-start gap-4 p-4 rounded-lg hover:bg-surface-container-high transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <view.icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[14px] font-bold text-on-surface font-display">{view.name}</p>
                                    <p className="text-[13px] text-on-surface-variant font-body mt-1 leading-relaxed">
                                        {view.desc}
                                    </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-on-surface-variant/40 group-hover:text-primary shrink-0 mt-1 transition-colors" strokeWidth={2} />
                            </NavLink>
                        ))}
                    </div>
                </section>

                <section className="bg-surface-container-low rounded-xl p-6">
                    <h3 className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-4">
                        Typowy przepływ
                    </h3>
                    <ol className="space-y-5">
                        {WORKFLOW_STEPS.map((step, i) => (
                            <li key={step.title} className="flex gap-4">
                                <span className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-[12px] font-bold text-primary font-mono shrink-0">
                                    {i + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[14px] font-bold text-on-surface font-display">{step.title}</p>
                                    <p className="text-[13px] text-on-surface-variant font-body mt-1 leading-relaxed">
                                        {step.body}
                                    </p>
                                    <NavLink
                                        to={step.path}
                                        className="inline-flex items-center gap-1.5 mt-2.5 text-[12px] font-semibold text-primary hover:opacity-80 transition-opacity font-body"
                                    >
                                        {step.label}
                                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                                    </NavLink>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="bg-surface-container-low rounded-xl p-6">
                    <h3 className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-4">
                        Scenariusz: commit z konfliktem
                    </h3>
                    <div className="text-[13px] text-on-surface-variant font-body leading-relaxed space-y-3">
                        <p>
                            1. W <strong className="text-on-surface font-semibold">Staging</strong> dodaj do staged
                            {' '}<code className="font-mono text-primary/90 text-[12px]">App.jsx</code> lub{' '}
                            <code className="font-mono text-primary/90 text-[12px]">Sidebar.jsx</code> i zrób Commit.
                        </p>
                        <p>
                            2. Przejdź do <strong className="text-on-surface font-semibold">Branches</strong> i kliknij Push
                            (lub użyj Commit &amp; Push w Staging).
                        </p>
                        <p>
                            3. Push zostanie odrzucony — otworzy się <strong className="text-on-surface font-semibold">Merge Tool</strong>.
                            Rozwiąż bloki (Accept Left / Accept Right), potem <strong className="text-on-surface font-semibold">Apply Merge</strong>.
                        </p>
                        <p>
                            4. W historii pojawią się dwa commity: Twój oryginalny oraz merge commit. Nastąpi przekierowanie do Repositories.
                        </p>
                    </div>
                </section>

                <section className="bg-surface-container-low rounded-xl p-6">
                    <h3 className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-2">
                        Terminal
                    </h3>
                    <p className="text-[13px] text-on-surface-variant font-body mb-4 leading-relaxed">
                        Symulowany shell Linuksa osadzony na dole layoutu. Komendy git korzystają z tego samego
                        store co widoki graficzne — zmiany w terminalu od razu widać w Staging i Branches.
                    </p>
                    <div className="rounded-lg bg-surface-container-lowest border border-outline-variant/30 overflow-hidden">
                        <div className="grid grid-cols-[1fr_1.4fr] px-4 py-2 bg-surface-container-high text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant font-body">
                            <span>Komenda</span>
                            <span>Opis</span>
                        </div>
                        {TERMINAL_COMMANDS.map((row) => (
                            <div
                                key={row.cmd}
                                className="grid grid-cols-[1fr_1.4fr] gap-4 px-4 py-2.5 border-t border-outline-variant/20 text-[12.5px] font-body"
                            >
                                <code className="font-mono text-primary/90">{row.cmd}</code>
                                <span className="text-on-surface-variant">{row.desc}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-surface-container-low rounded-xl p-6">
                    <h3 className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-on-surface-variant font-body mb-4">
                        Wskazówki
                    </h3>
                    <ul className="space-y-2.5">
                        {TIPS.map((tip) => (
                            <li key={tip} className="flex items-start gap-2.5 text-[13px] text-on-surface-variant font-body leading-relaxed">
                                <CircleDot className="w-3.5 h-3.5 text-secondary shrink-0 mt-1" strokeWidth={2} />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </div>
    );
}
