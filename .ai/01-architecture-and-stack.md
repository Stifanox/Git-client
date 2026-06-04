# Wytyczne dla Agenta AI: Architektura i Stos Technologiczny

## 1. Kontekst Projektu
Tworzysz aplikację webową "The Monolithic" – nowoczesnego klienta systemu Git. Aplikacja ma dostarczyć przejrzysty interfejs graficzny do zarządzania historią, gałęziami i rozwiązywania konfliktów.
**KRYTYCZNE ZAŁOŻENIE:** Aplikacja symuluje działanie systemu Git. Nie używamy `isomorphic-git` ani nie łączymy się z systemem plików w celu odpalania prawdziwych komend. Cały stan repozytorium jest trzymany i symulowany w pamięci za pomocą biblioteki Zustand.

## 2. Stos Technologiczny (Wymuszone wersje)
Do budowy projektu musisz użyć wyłącznie poniższych bibliotek w podanych wersjach:
* React & React DOM (`^19.2.6`)
* React Router DOM (`^7.15.1`)
* Zustand (`^5.0.13`) - do zarządzania stanem symulacji
* Tailwind CSS Vite (`^4.3.0`), Tailwind Merge (`^3.6.0`), clsx (`^2.1.1`) - do stylowania
* Lucide React (`^1.16.0`) - ikony wektorowe 
* Firebase (Authentication) - logowanie użytkownika 
* Hotjar Browser (`^1.0.9`) & React GA4 (`^3.0.1`) - analityka 

## 3. Struktura Katalogów
Projekt musi opierać się na wyraźnym podziale:
* `/src/pages` - widoki zmapowane 1:1 na routing.
* `/src/components` - reużywalne elementy UI (przyciski, karty Bento, modale).
* `/src/store` - logika stanu Zustand (symulator gita).
* `/src/services` - konfiguracja Firebase, Hotjar, Google Analytics.

## 4. Routing (React Router)
Aplikacja ma działać jako Single Page Application (SPA). Zaimplementuj następujące ścieżki:
* `/login` - ekran logowania.
* `/` (Dashboard / History) - główny ekran z grafem commitów.
* `/staging` - widok przygotowywania zmian (Unstaged / Staged) .
* `/branches` - architektura gałęzi (Local / Origin) .
* `/merge` - trójpanelowy Visual Merge Tool do rozwiązywania konfliktów .
* `/settings` - ustawienia profilu i ścieżek.
* `*` (Not Found) - fallback dla nieistniejących ścieżek.
  Wszystkie ścieżki oprócz `/login` muszą być chronione (Protected Routes) i wymagać zalogowania przez Firebase.