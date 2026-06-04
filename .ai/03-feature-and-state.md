# Wytyczne dla Agenta AI: Logika Biznesowa i Symulacja Stanu (Zustand)

## 1. Architektura Symulacji
Zamiast integracji z prawdziwym systemem Git, tworzysz symulator. Użyj biblioteki `zustand` do zbudowania globalnego stanu (Store). Store musi przechowywać zmockowane dane i funkcje modyfikujące stan.

## 2. Struktura Danych w Zustand
Zdefiniuj interfejsy/typy i początkowy stan dla:
* **User Profile:** Imię, Nazwisko, Email.
* **Commits (History):** Tablica obiektów (hash, autor, message, data, lista modyfikowanych plików, statystyki dodanych/usuniętych linii).
* **Branches:** Lista gałęzi lokalnych i zdalnych (Remote Origins). Zmienna trzymająca wskaźnik `HEAD` (aktualna gałąź).
* **Staging Area:** Dwie tablice plików: `unstaged` (zmodyfikowane, ale nie gotowe) oraz `staged` (gotowe do commita). Każdy plik musi mieć status (M - Modified, A - Added, D - Deleted) oraz pole ze zmockowanym Diffem (zawartość kodu przed i po) .

## 3. Akcje do Zaimplementowania (Symulacja Metod Systemowych)
Store w Zustand musi eksponować następujące akcje:
* `stage(fileId)` - przenosi plik z tablicy unstaged do staged.
* `unstage(fileId)` - przenosi plik ze staged do unstaged.
* `commit(message)` - czyści tablicę `staged`, generuje losowy hash, tworzy nowy obiekt commita i dodaje go na początek tablicy historii na aktualnej gałęzi .
* `checkout(branchName)` - zmienia wskaźnik `HEAD` na inną gałąź.
* `fetch() / pull() / push()` - asynchroniczne funkcje (z opóźnieniem `setTimeout` symulującym sieć). `pull` sporadycznie może zrzucać błąd (wywołując przejście do Visual Merge Tool).

## 4. Visual Merge Tool 
Kluczowa funkcja: trójpanelowy widok. Wykorzystaj zmockowane dane tekstowe reprezentujące plik z konfliktem.
* Lewy panel: Kod lokalny ("Ours") z przyciskiem "Accept Left".
* Prawy panel: Kod przychodzący ("Theirs") z przyciskiem "Accept Right".
* Środkowy panel: Edytowalny wynik scalania.
  Kliknięcie w przyciski akceptacji wstrzykuje wybraną sekcję kodu do panelu środkowego. Użyj komponentu tekstowego monospace.