# Hosting mateuszdombrowski.com: Cloudflare (stan od 18.10.2026)

## Jak to działa

- **DNS** domeny jest w Cloudflare (nameservery `andy.ns.cloudflare.com`, `romina.ns.cloudflare.com`, ustawione w Namecheap). Domena nadal jest zarejestrowana w Namecheap.
- **Strona** to Worker `portfolio` z plikami statycznymi (konfiguracja: `wrangler.jsonc`). Cloudflare buduje go z repozytorium `matidomber/Portfolio` po każdym pushu na `main` (`npx wrangler deploy`, bez komendy builda, bo `site/` jest gotowy w repozytorium).
- **Trasa** `mateuszdombrowski.com/*` kieruje cały ruch do Workera. Rekordy A (185.199.108–111.153) zostają jako wpis kierujący ruch przez Cloudflare i jako zapas: GitHub Pages dalej dostaje każdą wersję z workflow `.github/workflows/deploy.yml`, więc po wyłączeniu trasy strona sama wróciłaby na GitHub.
- **www → bez www:** reguła przekierowania (Rules → Redirect Rules, 301, z zachowaniem parametrów). Działa przed Workerem.
- **Szyfrowanie:** Always Use HTTPS włączone, minimum TLS 1.2, certyfikat Cloudflare aktywny. HSTS wysyła strona w `site/_headers`.
- **Nagłówki bezpieczeństwa i cache:** `site/_headers` (generuje `build.mjs`). Mozilla Observatory: A+ (12/12).
- **Adres workers.dev** wyłączony (`workers_dev: false`), żeby nie było drugiej publicznej kopii.
- **Poczta kontakt@:** Cloudflare Email Routing, reguła kontakt@mateuszdombrowski.com → matidomber14@gmail.com (rekordy MX `route1–3.mx.cloudflare.net`, SPF `include:_spf.mx.cloudflare.net`, DKIM `cf2024-1._domainkey`). Przekierowanie Namecheap (Redirect Email) przestało działać po zmianie nameserverów („554 Relay access denied”) i zostało zastąpione 18.10. Nowe adresy (np. oferty@) dodaje się w Email → Email Routing → Routing rules.
- **Search Console:** własność potwierdzona dwiema metodami (plik HTML i rekord TXT `google-site-verification=…` w DNS Cloudflare). Rekordu TXT nie usuwać.

## Publikowanie zmian

```bash
npm run build
```

Potem commit i push na `main`; Cloudflare wdraża w ok. 30 s. Lokalny podgląd identyczny z Cloudflare: `npx wrangler dev`.
