# AGENTS.md — The Monolithic

Przewodnik dla agentów AI pracujących w tym repozytorium. Opisuje **faktyczny** stan kodu oraz obowiązujące konwencje. Pełna specyfikacja produktowa znajduje się w katalogu [`.ai/`](.ai/) i jest źródłem prawdy dla wymagań — ten plik ma pierwszeństwo w kwestii tego, **jak** pisać kod w tym repo.

## 1. Czym jest projekt

"The Monolithic" to webowy klient Git z graficznym interfejsem (historia, gałęzie, staging, rozwiązywanie konfliktów).

**KRYTYCZNE:** Aplikacja **symuluje** Git w pamięci. Nie używamy `isomorphic-git`, nie dotykamy systemu plików, nie odpalamy prawdziwych komend. Cały stan repozytorium żyje w store'ach Zustand z mockowanymi danymi i akcjami.

## 2. Stos technologiczny (wymuszone wersje)

Używaj wyłącznie tych bibliotek (wersje w `package.json`):

- **React / React DOM** `^19.2.6`
- **React Router DOM** `^7.15.1`
- **Zustand** `^5.0.13` — zarządzanie stanem (symulator Git)
- **Tailwind CSS** `^4.3.0` (przez `@tailwindcss/vite`), **tailwind-merge** `^3.6.0`, **clsx** `^2.1.1` — stylowanie
- **lucide-react** `^1.16.0` — ikony
- **firebase** `^12.14.0` — Authentication + Firestore (profil)
- **@hotjar/browser** `^1.0.9`, **react-ga4** `^3.0.1` — analityka

Nie dodawaj nowych zależności bez wyraźnej potrzeby. Stos jest celowo zamrożony (wymóg akademicki).

## 3. Struktura katalogów (stan faktyczny)

> Uwaga: specyfikacja w `.ai/` wspomina o `/src/pages`, ale w repo strony żyją w `src/components/pages/`. Trzymaj się układu poniżej.

```
src/
├── App.jsx                      # routing + bootstrap analityki
├── main.jsx                     # entry point (StrictMode + createRoot)
├── index.css                    # @theme: tokeny kolorów, fontów, cieni
├── components/
│   ├── pages/                   # widoki 1:1 z routingiem (LoginPage, HistoryPage, ...)
│   ├── layout/                  # AppLayout, Sidebar, SettingsSection
│   ├── auth/                    # AuthBootstrap, ProtectedRoute, OnboardingGate, ProfileBootstrap
│   ├── ui/                      # reużywalne prymitywy (TextInput, Toggle, Modal)
│   ├── settings/                # pola formularza ustawień (SettingsFields)
│   ├── merge/                   # komponenty Visual Merge Tool (CodePanel, CodeLine, ...)
│   ├── staging/                 # sub-komponenty StagingPage (StatusBadge, FileRow, DiffViewer)
│   ├── history/                 # sub-komponenty HistoryPage (GraphNode, DiffLine, CommitDetails)
│   ├── branches/                # sub-komponenty BranchesPage (LocalBranchRow, RemoteBranchRow)
│   ├── repositories/            # sub-komponenty RepositoriesPage (ToolbarButton, Avatar, StatPill)
│   └── AnalyticsListener.jsx    # śledzenie pageview na zmianę trasy
├── store/                       # store'y Zustand (useGitStore, useMergeStore, useRepoStore, ...)
├── services/                    # firebase.js, analytics.js, userProfile.js
└── merge/                       # czysta logika silnika merge (engine, gitAdapter, scenarios)
```

### Konwencja dzielenia komponentów

- **Jeden komponent na plik**, `export default`. Strona zostaje "chuda" — sub-komponenty prezentacyjne wydzielaj do folderu nazwanego od feature'a (`components/<feature>/`), wzorem `merge/`.
- Czyste helpery (funkcje bez JSX) mogą zostać współlokowane na dole pliku strony.
- Import sub-komponentów bez rozszerzenia (`import FileRow from '../staging/FileRow'`); importy ze `store`/`services` zwykle z rozszerzeniem `.js`. Trzymaj się stylu sąsiednich plików.

## 4. Routing (`src/App.jsx`)

SPA na `BrowserRouter`. Trasy:

- `/login` — publiczna.
- `/onboarding` — chroniona, za `OnboardingGate` (uzupełnienie profilu).
- `/settings`, `/repositories`, `/history`, `/staging`, `/branches`, `/merge` — chronione, w `AppLayout`.
- `/` → redirect na `/settings`. `*` (not found) → redirect na `/settings`.

Wszystko poza `/login` chronione przez `ProtectedRoute` (wymaga sesji Firebase). `AnalyticsListener` jest osadzony wewnątrz `BrowserRouter`.

## 5. Design system — "The Architectural Stream"

Wyłącznie **dark mode (Onyx)**. Tokeny zdefiniowane w `src/index.css` w bloku `@theme` — **używaj klas Tailwind mapowanych na tokeny, nie hardkoduj hexów** (w istniejącym kodzie zdarzają się wyjątki typu `#004395` na przyciskach — nie powielaj tego w nowym kodzie).

- **Głębia przez tło, nie bordery.** Główne sekcje rozdzielaj zmianą warstwy tła (tonal shift), nie liniami.
- **Warstwy:** `surface` `#0e0e0e` → `surface-container-lowest` `#050505` (inputy) → `surface-container-low` `#131313` (sidebar) → `surface-container-high` `#1f2020` (hover/aktywne) → `surface-container-highest` `#252626` (modale).
- **Akcenty:** `primary` `#adc6ff` (akcje), `secondary` `#06b77f` (dodane linie diff / sukces), `tertiary` `#ff716a` (usunięte linie / błąd).
- **Tekst:** `on-surface` `#e7e5e5` (główny — **nigdy czysta biel**), `on-surface-variant` `#a3a3a3` (ścieżki, timestampy).
- **Typografia:** `font-display` Manrope (nagłówki), `font-body` Inter (UI), `font-mono` JetBrains Mono (kod, hashe, diff — domyślnie 13px). Duże nagłówki: `tracking-editorial`.
- **Bento Box:** karty z `rounded-bento` (12px). Przyciski reużywalne, składane przez `clsx` + `tailwind-merge`, płaskie tła zamiast Material-shadow.
- **Cienie:** bez ostrych drop-shadow; do "pływających" elementów użyj `shadow-ambient` (duży blur, ~8% krycia).

## 6. Stan i logika (Zustand)

- Store'y w `src/store/`, jeden plik per domena (`useGitStore`, `useMergeStore`, `useRepoStore`, `useHistoryStore`, `useAuthStore`, `useSettingsStore`).
- Selektory eksportuj jako nazwane funkcje (`selectFilteredCommits`, `selectUnresolvedBlocks`, ...) i używaj `useShallow` przy wybieraniu wielu pól.
- Akcje symulujące Git: `stage`, `unstage`, `commit`, `checkout`, `createBranch`, `fetch/pull/push` (async z `setTimeout`; `pull` może rzucić konflikt → Merge Tool).
- **Visual Merge Tool** (`/merge`): trójpanelowy — lewy "Ours" (Accept Left), prawy "Theirs" (Accept Right), środkowy edytowalny wynik. Logika scalania w `src/merge/` (czysta, testowalna), prezentacja w `src/components/merge/`.

## 7. Integracje (wymogi akademickie)

- **Firebase Auth:** e-mail/hasło. Konfiguracja w `services/firebase.js`, sesja bootstrapowana przez `AuthBootstrap`. Trasy chronione `ProtectedRoute`.
- **Analityka:** inicjalizacja w `services/analytics.js` (`initAnalytics()` wołane w `App.jsx`). GA4 (`react-ga4`) + Hotjar (`@hotjar/browser`). `AnalyticsListener` wysyła `pageview` przy zmianie `location.pathname`.
- **Konfiguracja przez env:** `VITE_GA_MEASUREMENT_ID`, `VITE_HOTJAR_SITE_ID`, `VITE_HOTJAR_VERSION` oraz klucze Firebase. Nigdy nie commituj sekretów — używaj `.env` (wzór w `.env.example`).

## 8. Workflow i weryfikacja

- Dev: `npm run dev` · Build: `npm run build` · Lint: `npm run lint` · Podgląd: `npm run preview`.
- **Po zmianach uruchom `npm run lint` oraz `npm run build`** — build musi przechodzić bez błędów (gotowość do one-click deploy, np. Vercel/Railway).
- Styl kodu: wcięcia 4 spacje, brak komentarzy opisujących oczywistości, komunikaty/teksty UI bywają po polsku — zachowaj spójność z sąsiednim plikiem.
- Nie podłączaj prawdziwego Gita ani FS — wszystko pozostaje symulacją w pamięci.
