# Wytyczne dla Agenta AI: Design System i Interfejs (UI/UX)

## 1. Filozofia "The Architectural Stream"
Interfejs musi sprawiać wrażenie wyrzeźbionego z jednego bloku obsydianu. Zabronione jest używanie standardowych linii (borderów) do oddzielania głównych sekcji. Głębokość budujemy poprzez subtelne zmiany tła (tonal shifts).

## 2. Kolorystyka (Dark Mode - Onyx Theme)
Używaj wyłącznie ciemnego motywu. Konfiguracja Tailwind musi uwzględniać:
* `background`: `#0e0e0e` (Deep Black - absolutne tło aplikacji).
* `surface-container-low`: `#131313` (Elevated Surface - nawigacja, sidebar).
* `surface-container-high`: `#1f2020` (hover states, aktywne panele).
* `primary`: `#3B82F6` (Action Blue - główne akcje np. Commit).
* `success`: Wbudowany zielony z palety Tailwind (dodane linie kodu).
* `danger`: Wbudowany czerwony z palety Tailwind (usunięte linie kodu).
  Brak 100% białego koloru. Używaj jasnych szarości dla tekstów (np. `#e7e5e5`).

## 3. Typografia 
* **Interfejs i nagłówki:** Używaj fontów bezszeryfowych z rodziny `Manrope` (nagłówki) oraz `Inter` (elementy UI).
* **Kod i Hashe Git:** Używaj fontów stałoszerokościowych (Monospace, np. `JetBrains Mono` lub `Roboto Mono`) do podglądu Diff, wiadomości commitów oraz sum SHA1. Rozmiar fontu kodu domyślnie 13px.

## 4. Układ i Komponenty (Bento Box Layout) 
* **Bento Box:** Elementy interfejsu mają być zamknięte w kartach (boxes) z zaokrągleniami rzędu `12px` (`rounded-xl` w Tailwind).
* **Przyciski:** Reużywalne komponenty zbudowane przy pomocy `clsx` i `tailwind-merge`. Zamiast cieniowania ("Material Design") stosuj płaskie tła z łagodnymi zaokrągleniami.
* **Układ główny:** Aplikacja musi mieć stały Header (breadcrumbs, wyszukiwarka, akcje Fetch/Pull/Push) oraz Sidebar (Repositories, Branches, History, Staging, Settings).

## 5. Cienie i Głębia
Unikaj ostrych drop-shadows. Jeśli element (np. modal) musi "pływać", użyj dużego rozmycia (20-40px blur) z małym kryciem (8%).