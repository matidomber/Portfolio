# Przeniesienie mateuszdombrowski.com na Cloudflare Pages

Po co: GitHub Pages nie pozwala ustawić nagłówków bezpieczeństwa (CSP, HSTS, Permissions-Policy) ani długiego cache. Cloudflare Pages (plan Free) czyta je z pliku `site/_headers`, daje Brotli, HTTP/3 i serwery w Polsce. Kod zostaje w tym samym repozytorium GitHub; nic nie trzeba budować w chmurze, bo folder `site/` jest gotowy.

Wszystko poniżej robisz Ty (konta i DNS są Twoje). Czas: ok. 20 minut plus czekanie na DNS.

## 0. Zanim zaczniesz: zapisz obecne rekordy DNS

W Namecheap → Domain List → Manage → Advanced DNS zrób zrzut ekranu wszystkich rekordów. Szczególnie **MX i TXT** (poczta kontakt@mateuszdombrowski.com musi działać dalej). Jeśli nie ma rekordów MX, poczta jest gdzie indziej (np. przekierowanie Namecheap „Email Forwarding”, które przy zmianie nameserverów przestaje działać; wtedy przekierowanie trzeba ustawić w Cloudflare: Email → Email Routing, też bezpłatne).

## 1. Konto i projekt Pages

1. https://dash.cloudflare.com → Sign up (plan Free).
2. Po lewej **Workers & Pages → Create → Pages → Connect to Git**.
3. Połącz GitHub, wskaż repozytorium **matidomber/Portfolio**.
4. Ustawienia:
   - Project name: `mateuszdombrowski` (adres testowy będzie `mateuszdombrowski.pages.dev`),
   - Production branch: `main`,
   - Framework preset: **None**,
   - Build command: **puste**,
   - Build output directory: **`site`**.
5. **Save and Deploy**. Po minucie strona działa pod `https://mateuszdombrowski.pages.dev`. Sprawdź ją: loader, przejścia między podstronami, formularz.

Sprawdzenie nagłówków (w PowerShell):

```bash
curl.exe -sI https://mateuszdombrowski.pages.dev/ | findstr /i "content-security strict-transport x-content cache-control cf-ray"
```

Powinny być: `content-security-policy`, `strict-transport-security`, `x-content-type-options: nosniff`, `cache-control`, `cf-ray`.

## 2. Domena w Cloudflare (DNS)

1. W Cloudflare: **Add a domain** → `mateuszdombrowski.com` → plan Free. Cloudflare zeskanuje obecne rekordy. **Porównaj ze zrzutem z punktu 0**; brakujące MX/TXT dodaj ręcznie. Rekordy A (185.199.108–111.153, GitHub Pages) zostaw na razie.
2. Cloudflare poda dwa nameservery (np. `xxx.ns.cloudflare.com`). W Namecheap → Domain → **Nameservers: Custom DNS** → wklej oba → zapisz.
3. Czekaj, aż Cloudflare pokaże domenę jako **Active** (zwykle 10–60 minut, maks. 24 h).

## 3. Podpięcie domeny do Pages

1. Workers & Pages → projekt → **Custom domains → Set up a custom domain** → `mateuszdombrowski.com`. Cloudflare zaproponuje zamianę rekordów A na CNAME do `mateuszdombrowski.pages.dev`; zgódź się.
2. Dodaj też `www.mateuszdombrowski.com` (plik `site/_redirects` przekieruje www na adres bez www).
3. **SSL/TLS → Overview → Full (strict)** i **Edge Certificates → Always Use HTTPS: On**.

Sprawdzenie:

```bash
curl.exe -sI https://mateuszdombrowski.com/ | findstr /i "content-security cf-ray server"
```

`server: cloudflare` i `content-security-policy` oznaczają, że ruch idzie już przez Cloudflare.

## 4. Porządki po przeniesieniu

- GitHub → repozytorium → Settings → Pages → **Unpublish site** (żeby stara kopia nie wisiała równolegle). Potem można usunąć `.github/workflows/deploy.yml` i `src/CNAME`.
- Search Console nic nie zmienia: te same adresy, ten sam plik weryfikacyjny `google25cec84b609ddea3.html` jest w `site/`.
- Każdy kolejny push na `main` publikuje się sam w ok. minutę.

## Jak publikować zmiany

```bash
npm run build
```

Potem commit folderu `src/` i `site/` oraz push. Cloudflare Pages bierze gotowy `site/`.
