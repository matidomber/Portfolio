# Przeniesienie mateuszdombrowski.com na Cloudflare

Po co: GitHub Pages nie wysyła nagłówków bezpieczeństwa (CSP, HSTS, Permissions-Policy) i trzyma cache 10 minut. Cloudflare czyta je z `site/_headers`, kompresuje Brotli i ma serwery w Polsce.

Cloudflare zmienił kreator (2026): projekt zakłada się jako **Worker z plikami statycznymi**, a nie „Pages”. Repozytorium jest pod to przygotowane: `wrangler.jsonc` w głównym folderze wskazuje folder `site/`. Zachowanie (nagłówki, podstrony, 404) sprawdzone lokalnie na serwerze Cloudflare (`npx wrangler dev`).

## 1. Projekt (formularz „Set up your application”)

| Pole | Wartość |
|---|---|
| Repozytorium | `matidomber/Portfolio` |
| Project name | `portfolio` (musi się zgadzać z `name` w `wrangler.jsonc`) |
| Build command | **puste** (folder `site/` jest gotowy w repozytorium) |
| Deploy command | `npx wrangler deploy` |
| Preview command | bez zmian |
| Enable Preview builds | wyłącz (niepotrzebne) |
| Protect with Cloudflare Access | wyłączone |
| Advanced settings → Path | `/` |
| API token | zostaw „Create new token” (Cloudflare utworzy go sam) |

Kliknij **Deploy**. Po ok. minucie strona działa pod adresem `portfolio.<twoja-subdomena>.workers.dev`. Każdy push na `main` publikuje się sam.

## 2. Domena w Cloudflare

1. W panelu: **Add a domain** → `mateuszdombrowski.com` → plan **Free**. Cloudflare sam wczyta obecne rekordy DNS.
2. Sprawdź, czy są te rekordy poczty (przekierowanie kontakt@ przez Namecheap). Jeśli któregoś brakuje, dodaj ręcznie:
   - MX `@` → `eforward1.registrar-servers.com`, priorytet 10
   - MX `@` → `eforward2.registrar-servers.com`, priorytet 10
   - MX `@` → `eforward3.registrar-servers.com`, priorytet 10
   - MX `@` → `eforward4.registrar-servers.com`, priorytet 15
   - MX `@` → `eforward5.registrar-servers.com`, priorytet 20
   - TXT `@` → `v=spf1 include:spf.efwd.registrar-servers.com ~all`
3. Cloudflare poda dwa nameservery (`…ns.cloudflare.com`). W Namecheap: Domain List → Manage → **Nameservers: Custom DNS** → wklej oba → zapisz.
4. Poczekaj, aż domena w Cloudflare będzie **Active** (zwykle 10–60 minut).

## 3. Podpięcie domeny do Workera

1. Cloudflare → DNS → Records: usuń 4 rekordy **A** dla `mateuszdombrowski.com` (185.199.108–111.153, stary GitHub Pages) i rekord dla `www`, jeśli jest. Rekordów MX i TXT nie ruszaj.
2. Workers & Pages → **portfolio** → Settings → **Domains & Routes** → Add → **Custom domain** → `mateuszdombrowski.com`. Cloudflare sam utworzy rekord i certyfikat.
3. Przekierowanie www na adres bez www:
   - DNS → Add record: typ **A**, nazwa `www`, adres `192.0.2.1`, Proxy **włączone** (pomarańczowa chmurka);
   - Rules → **Redirect Rules** → Create rule → szablon **„Redirect from WWW to root”** → Deploy.
4. SSL/TLS → Edge Certificates → **Always Use HTTPS: On**.

## 4. Sprawdzenie

```bash
curl.exe -sI https://mateuszdombrowski.com/
```

Mają być: `server: cloudflare`, `content-security-policy`, `strict-transport-security`. Wyślij też maila na kontakt@mateuszdombrowski.com i sprawdź, czy doszedł. Jeśli nie, włącz w Cloudflare **Email → Email Routing** (kontakt@ → Twój Gmail), Cloudflare sam podmieni rekordy MX.

Napisz „gotowe”: Claude sprawdzi nagłówki, podstrony, formularz, Search Console i posprząta po GitHub Pages (workflow i plik CNAME).
