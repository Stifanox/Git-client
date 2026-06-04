# Wytyczne dla Agenta AI: Integracje Wymagane (Wymogi Akademickie)

## 1. Firebase Authentication (Logowanie)
Aplikacja musi wspierać logowanie e-mail/hasło.
* Zaimplementuj komponent `LoginPage.jsx` z formularzem.
* Użyj metod `getAuth()`, `signInWithEmailAndPassword`, `signOut` z SDK Firebase.
* Zabezpiecz trasy w React Router – próba wejścia na np. `/dashboard` bez bycia zalogowanym musi przekierowywać na `/login`.

## 2. Hotjar (Analiza Zachowań)
* Biblioteka: `@hotjar/browser`.
* Zainicjuj Hotjar globalnie na poziomie głównego komponentu (`App.jsx` lub `main.jsx`) w bloku `useEffect`. Użyj zmockowanych wartości `siteId` oraz `hotjarVersion` gotowych do podmiany.

## 3. Google Analytics 4 
Aplikacja to SPA, dlatego śledzenie wyświetleń podstron musi reagować na zmiany w React Router.
* Biblioteka: `react-ga4`.
* Zainicjuj `ReactGA.initialize("G-XXXXXXXXXX")` w głównym komponencie (tylko raz na start).
* Utwórz osobny komponent `AnalyticsListener`, podłącz do niego hook `useLocation` z React Router.
* Przy każdej zmianie wartości `location.pathname`, wysyłaj zdarzenie: `ReactGA.send({ hitType: "pageview", page: location.pathname + location.search })`.
* Osadź `AnalyticsListener` bezpośrednio w komponencie `<BrowserRouter>`.

## 4. Przygotowanie do wdrożenia (Deployment & README)
* Projekt korzysta z Vite, upewnij się, że polecenia `npm run build` przebiegają bez błędów. Kod musi być gotowy do wrzucenia na platformy "one-click deploy" takie jak Vercel lub Railway.
* Wygeneruj szkic pliku `README.md` zgodnego z checklistą uczelni. Powinien zawierać miejsce na: Opis projektu, instrukcję uruchomienia, miejsce na screeny z aplikacji, miejsce na screeny z GA4 oraz Hotjar.