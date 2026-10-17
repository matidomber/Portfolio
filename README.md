# mateuszdombrowski.com

Strona usługowa Mateusza Dombrowskiego: strony i aplikacje dla firm, automatyzacje sklepów na BaseLinkerze.

## Jak to jest zbudowane

- **Źródła:** `src/`
  - `pages/` – trzy strony i 404; każda zaczyna się od nagłówka `<!--@page {...} -->` z tytułem, opisem i ustawieniami,
  - `partials/` – wspólne fragmenty (`head`, `loader`, `header`, `about`, `contact`, `footer`),
  - `css/styles.css`, `js/app.js`, `js/vendor/` (GSAP, ScrollTrigger, Draggable, InertiaPlugin, Lenis),
  - `img/` – oryginały zdjęć (build robi z nich AVIF, WebP i JPG w kilku szerokościach),
  - `fonts/` – podzbiory woff2 (Mona Sans, Reddit Mono, Doto, Libre Barcode 128; licencja OFL) serwowane z własnej domeny.
- **Build:** `npm run build` (`build.mjs`, Node 20+). Składa strony z fragmentów, robi polską typografię (twarde spacje), minifikuje HTML/CSS/JS, nadaje plikom nazwy z hashem, liczy hash skryptu inline do CSP i pisze `_headers` oraz `_redirects` dla Cloudflare Pages.
- **Wynik:** folder `site/` (commitowany). Czysty HTML, CSS i JavaScript, bez frameworka.
- **Podgląd:** `npm run serve` i `http://127.0.0.1:8080/`. Loader przy pierwszej wizycie w sesji; `?loader` wymusza go ponownie.

## Publikacja

- **Cloudflare Pages** serwuje folder `site/` z gałęzi `main` (bez komendy builda). Nagłówki bezpieczeństwa i cache są w `site/_headers`.
- GitHub Actions (`.github/workflows/deploy.yml`) wysyła ten sam folder na GitHub Pages; zostaje jako zapas do czasu pełnego przeniesienia DNS.
- Poprzednia wersja (React, Vite, three.js) jest zapisana pod tagiem `stara-strona-2026-10`.
