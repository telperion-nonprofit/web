# Audit webu telperion.cz

Datum auditu: 2026-10-12
Stav kódu: `main` @ `b730cd4` (Astro 7.3, Tailwind 4, Vercel adapter)

Tento report shrnuje technický audit repozitáře a lokálního produkčního buildu:
funkčnost, SEO a i18n, přístupnost, výkon, bezpečnost, kvalita kódu, testy a CI.
Nálezy jsou seřazené podle priority; u každého je důkaz (soubor, build) a
doporučená oprava.

## 1. Shrnutí

Web je technicky v dobrém stavu: statický Astro build bez klientského
frameworku, zelené CI (format, lint, `astro check`, 33 unit testů, build,
kontrola `<head>`), 0 zranitelností v produkčních závislostech, Lighthouse SEO
100, přístupnost 95–100, best practices 96, výkon 76–86 (lokální měření).
Největší problémy jsou funkční a obsahové, ne infrastrukturní:

1. **Přepínač jazyka a hreflang na všech 24 článcích vedou na 404** (slugy
   článků se v CZ a EN liší, překlad cesty je jen prefixový).
2. **Chybějící překladové klíče se vypisují doslova** („modal.close“ ve
   screen-reader popisku tlačítka zavřít, „podcast.platform.spotify“ v title).
3. **Dekorativní SVG listů váží 311 KB** (vložené PNG) a stahuje se s nejvyšší
   prioritou na každé stránce – 45–60 % přenesených dat.
4. **Mrtvý kód propagačního modalu** akce z 9. 4. 2026 se stále posílá
   s úvodní stránkou.
5. **EN stránky mají českou meta description a žádná stránka nemá og:image.**

Doporučení: jeden opravný sprint na nálezy V1–V5 (odhad 1–2 dny), poté
střední priorita po částech. Plán je v kapitole 8.

## 2. Rozsah a metodika

Kontrolováno:

- Konfigurace (`astro.config.mjs`, `vercel.json`, `tsconfig.json`, ESLint,
  Prettier, Playwright, Sentry, Dependabot, CI workflow).
- Všech 47 stránek buildu, layout, 12 komponent, utility, i18n slovníky,
  22 článků, 40 testovacích souborů, skripty, dokumentace v `docs/`.
- Lokální produkční build (`npm run build`) obsloužený statickým serverem.

Nástroje: `npm ci`, Prettier, ESLint, `astro check`, `node:test`,
`astro build` + `check:head`, `npm audit` / `npm outdated`, axe-core 4
(17 scénářů včetně otevřených modalů, mobilního menu a jazykového menu),
Lighthouse 13 (mobilní emulace, 4 stránky), Playwright (projekt chromium),
výpočet kontrastu barev, ruční čtení kódu.

Co **nebylo** ověřeno: živý web `www.telperion.cz`. Síťová politika
prostředí auditu blokovala přístup na doménu a Vercel projekt není dostupný
přes připojený účet. Hlavičky na produkci (CSP, HSTS), reálné Core Web
Vitals, nastavení Vercel projektu (Node 24, env proměnné Sentry) a přesměrování
odkazu na GitHub je potřeba zkontrolovat ručně – příkazy jsou v kapitole 9.

## 3. Výsledky automatických kontrol

| Kontrola                         | Výsledek                                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run format:check`           | OK                                                                                                 |
| `npm run lint`                   | OK                                                                                                 |
| `npm run typecheck`              | 0 chyb, 0 varování, 15 hintů (nepoužité proměnné v `tests/benchmark_i18n.ts`)                      |
| `npm run test:unit`              | 33/33 OK                                                                                           |
| `npm run build`                  | OK, 47 stránek za 11 s, `dist/` 9,1 MB                                                             |
| `npm run check:head`             | OK (41 stránek, 6 redirect stubů `/test/*`)                                                        |
| `npm audit --omit=dev`           | 0 zranitelností                                                                                    |
| `npm audit` (včetně dev)         | 1 moderate: `fast-uri` (transitivní dev závislost), opraví `npm audit fix`                         |
| `npm outdated`                   | jen minor/patch; majory čekají u `prettier-plugin-astro` (1.x) a `typescript` (7.x)                |
| Playwright (chromium, 111 testů) | 107 OK, 4 přeskočené (desktop-only/mobile-only varianty), 0 chyb                                   |
| axe-core (17 scénářů)            | 0 kritických; `color-contrast` (6 scénářů), `heading-order` (3), `label-content-name-mismatch` (1) |
| Lighthouse (mobil, lokálně)      | výkon 76–86, přístupnost 95–100, best practices 96, SEO 100 – detail v příloze B                   |

Poznámka k Lighthouse: lokální server bez komprese a cache hlaviček, hodnoty
LCP (3,9–4,8 s v simulovaném mobilu) berte orientačně; relativní nálezy
(render-blocking CSS, váha SVG, CLS) platí. Jediné chyby v konzoli jsou 404 na
`/_vercel/insights/script.js` a `/_vercel/speed-insights/script.js` – artefakt
lokálního serveru, na Vercelu nenastává.

Poznámka k Playwrightu: sada běžela jen v projektu chromium, s Chromiem
předinstalovaným v prostředí auditu (revize 1194 místo 1248, kterou vyžaduje
`@playwright/test` 1.64; stažení správné revize bylo blokované). Projekty
firefox, webkit, Mobile Chrome a Mobile Safari nebyly spuštěny – v CI běží
všechny a poslední run na `main` je zelený.

## 4. Nálezy – vysoká priorita

### V1 Přepínač jazyka a hreflang na článcích vedou na 404

- **Důkaz:** `translatePath()` v `src/utils/lang.ts` překládá jen prefix cesty
  (`/clanky/<slug>` → `/en/articles/<slug>`), ale slugy článků se liší
  (`zmena-klimatu` ↔ `climate-change`, 12 párů). V buildu má
  `dist/clanky/zmena-klimatu/index.html` `hreflang="en"
href="…/en/articles/zmena-klimatu"` a adresář `dist/en/articles/zmena-klimatu`
  neexistuje; obráceně totéž. Stejnou cestu generuje `LanguageDropdown.astro`.
- **Dopad:** 24 stránek. Návštěvník při přepnutí jazyka na článku skončí na 404. Google dostává neplatné hreflang páry a může hreflang ignorovat i jinde.
- **Doporučení:** do frontmatteru článků přidat `translationKey` (stejná hodnota
  pro CZ i EN verzi) a validovat ho v `src/content.config.ts`; `Layout.astro`
  a `LanguageDropdown.astro` přijmou volitelný prop s URL alternativy; pokud
  překlad neexistuje, `hreflang` vynechat a přepínač vést na seznam článků.
  Doplnit unit test, že každý `translationKey` má právě jednu CZ a jednu EN
  verzi.

### V2 Chybějící překladové klíče se renderují jako text

- **Důkaz:** `t("modal.close")` (`src/components/Modal.astro:36`,
  `DonationModal.astro:38`) a `t("podcast.platform.spotify|apple|youtube")`
  (`src/pages/podcast.astro`, `en/podcast.astro`) nemají klíč v `cs-CZ.json` ani
  `en.json`. V buildu je doslova `<span class="sr-only">modal.close</span>`
  (čte ho screen reader) a `title="podcast.platform.spotify"`.
- **Doporučení:** doplnit klíče; přidat unit test, který vytáhne všechna
  `t("…")` ze `src/` a ověří existenci v obou slovnících (regex
  `t\("([^"]+)"\)`); v DEV režimu může `t()` logovat varování.

### V3 Dekorativní SVG listů: 311 KB s `fetchpriority="high"`

- **Důkaz:** `src/assets/leaves.svg` má 317 783 B, z toho 308 KB jsou tři
  vložené PNG v base64 (gzip pomůže jen na 234 KB). `Layout.astro` ho vkládá
  dvakrát s `fetchpriority="high" loading="eager"`. Podle Lighthouse tvoří
  311 KB z 517–697 KB přenosu každé stránky.
- **Dopad:** soutěží s CSS, fonty a logem v kritické fázi načítání, na mobilu
  prodlužuje LCP. Test `tests/lcp-priority.spec.ts` tento stav vynucuje.
- **Doporučení:** překreslit listy jako čistý vektor bez rastru (cíl < 20 KB),
  nebo exportovat jako WebP/AVIF; odebrat `fetchpriority="high"` (dekorace nemá
  být LCP kandidát) a upravit test; spodní instanci dát `loading="lazy"`.

### V4 Mrtvý kód propagačního modalu „Klimatická mozaika 9. 4. 2026“

- **Důkaz:** `src/pages/index.astro` (řádky ~370–520) a `en/index.astro`:
  modal, texty („Zbývá 11 volných míst!“), registrační odkaz s `tenant_token`
  a inline skript s cutoff 10. 4. 2026. Dnes se nezobrazí, ale HTML i skript
  se posílají při každém načtení úvodní stránky; 12 testovacích souborů ho musí
  nejdřív potlačit přes `sessionStorage.climateFreskModalSeen`.
- **Doporučení:** odstranit. Pokud se akce opakují, zavést content collection
  `events` s datem a renderovat modal jen při buildu, když je datum v
  budoucnosti (žádný klientský skript, žádný stav v sessionStorage).

### V5 SEO metadata: česká description na EN stránkách, chybí og:image

- **Důkaz:** `Layout.astro` má výchozí `description = "Mladí učí o klimatu…"`
  (česky). Z EN stránek description předávají jen články a privacy policy;
  `/en/`, `/en/contacts/`, `/en/articles/`, `/en/podcast/`, `/en/workshops/*`
  a `/en/social-media/` mají v buildu českou description. Žádná stránka
  nepředává `image`, takže chybí `og:image`/`twitter:image`; chybí `og:locale`
  a `og:site_name`; titulek úvodní stránky je „Domů | Telperion“.
- **Doporučení:** výchozí description přes `t("meta.description")`; výchozí
  sdílený obrázek 1200×630 v `public/` + `twitter:card="summary_large_image"`;
  titulek úvodní stránky „Telperion – Mladí učí o klimatu“ (CZ) / „Telperion –
  Young people teach about climate“ (EN); `og:locale` `cs_CZ`/`en_US`,
  `og:site_name` „Telperion“.

## 5. Nálezy – střední priorita

### S1 Přístupnost: kontrast doplňkového textu

- **Důkaz (axe):** `text-dark-green/60` = 4,38:1 na 14 px textu (role členů
  týmu ×13 na `/kontakty` i `/en/contacts`, data článků ×11, „Poslední
  aktualizace“, „Číslo účtu“ 12 px v darovacím modalu); `text-dark-green/50`
  = 3,24:1 („Připravují: …“ na `/programy/dalsi-programy`);
  `text-dark-green/40` = 2,45:1 (placeholder, ikony platforem na `/podcast`).
  WCAG AA vyžaduje 4,5:1 pro běžný text.
- **Doporučení:** pro tlumený text používat nejméně `/70` (6,05:1); zavést
  token `--color-muted` v `global.css` a nižší opacity pro text nepoužívat.

### S2 Přístupnost: pořadí nadpisů a nadpis stránky 404

- **Důkaz (axe):** h1 → h3 (`pro-verejnost`, `dalsi-programy`), h2 → h4
  (`pro-skoly`). Na 404 je `<h1>404</h1>` v `text-brand-green/20`
  (kontrast ≈ 1,3:1) a skutečný nadpis „Jejda! …“ je h2.
- **Doporučení:** dodržet posloupnost (h3 → h2, h4 → h3); na 404 povýšit
  „Jejda! Tady rostou jen stromy.“ na h1 a číslo vykreslit jako dekorativní
  `<span aria-hidden="true">`.

### S3 Přístupnost: modaly bez správy fokusu

- **Důkaz:** `Modal.astro` a `DonationModal.astro` mají `role="dialog"
aria-modal="true"`, ale po otevření se fokus nepřesune do dialogu, po
  zavření se nevrací, pozadí zůstává dostupné klávesnicí (žádný focus trap ani
  `inert`). Kontaktní modal nereaguje na Escape a nezamyká scroll stránky
  (darovací ano) – chování obou se liší. Mobilní menu nejde zavřít Escape ani
  klikem mimo.
- **Doporučení:** nahradit vlastní implementaci nativním `<dialog>` +
  `showModal()` (fokus, Escape, inertní pozadí jsou zdarma) v jedné sdílené
  komponentě `BaseModal.astro`; totéž pro lightbox.

### S4 Přístupnost a i18n: popisky v nesprávném jazyce, ikony bez `aria-hidden`

- **Důkaz:** `aria-label="Otevřít menu"` a `aria-label="Zavřít"` na EN
  stránkách; `aria-label="Close"`, `aria-label="Photo lightbox"`,
  `alt="Jakub presenting"`, `alt="Telperion Logo"` na CZ stránkách; `alt`
  fotek na úvodní stránce recykluje texty tlačítek (`home.hero.button_team`).
  Na `/socialni-site` axe hlásí `label-content-name-mismatch` ×6 (aria-label
  „Instagram CZ - otevřít externí odkaz“ neobsahuje viditelný text karty).
  29 z 30 inline SVG ikon na úvodní stránce nemá `aria-hidden="true"`
  (`astro-icon` ho nepřidává automaticky).
- **Doporučení:** všechny popisky přes `t()`; u karet sociálních sítí
  `aria-label` odebrat a doplnit sr-only „(otevře se v novém okně)“; ikonám
  předávat `aria-hidden="true"`, nejlépe přes wrapper komponentu s výchozí
  hodnotou.

### S5 Výkon: lightbox otevírá originální JPEG (1,2–1,65 MB)

- **Důkaz:** `data-full-src={teamPhoto.src}` v `index.astro` a
  `kontakty.astro` odkazuje na neoptimalizovaný originál:
  `dist/_astro/team.*.jpg` 1 218 797 B, `teamwork.*.jpg` 1 300 356 B
  (3024×4032), `jakub-presenting.*.jpg` 1 652 242 B (včetně EXIF). Jen kvůli
  tomuto odkazu Astro kopíruje originály do `dist/`.
- **Doporučení:** v frontmatteru `getImage({ src, width: 1600, format: "webp"
})` a předat výsledné `.src`; odhad 1,3 MB → ~150 KB na fotku.

### S6 Výkon: fonty bez preloadu, CLS na `/kontakty`, nepoužité fonty

- **Důkaz:** import celých balíčků `@fontsource-variable/*` dává do `dist/`
  13 woff2 subsetů (cyrilice, řečtina, vietnamština) – balast nasazení;
  žádný `<link rel="preload">` pro latinské řezy Manrope/Playfair, takže
  nadpisy vykreslí nejdřív náhradní font (FOUT). Lighthouse CLS 0,149 na
  `/kontakty` (posun bloku s týmovou fotkou pod nadpisem, pravděpodobně výměna
  fontu). `public/fonts/*.woff2` (6 souborů, 180 KB) se nikde nepoužívají.
- **Doporučení:** přejít na Astro Fonts API (`fonts` v `astro.config.mjs`)
  se `subsets: ["latin", "latin-ext"]` a preloadem, nebo importovat jen
  `@fontsource-variable/manrope/latin.css` + `latin-ext.css`; smazat
  `public/fonts`.

### S7 Bezpečnost: CSP je prakticky neúčinná

- **Důkaz:** `vercel.json`: `script-src 'self' 'unsafe-inline' 'unsafe-eval'
https:`, `style-src … https:`, `connect-src https: wss:`, `frame-src https:`.
  Povoluje libovolný HTTPS skript i `eval`; chybí `base-uri`, `form-action`,
  `frame-ancestors`. Inline `onclick="…"` (`index.astro:51`, `podcast.astro:79`
  a EN verze) a inline skripty si vynucují `'unsafe-inline'`. Iframe mapy má
  `allow="geolocation"`, zatímco hlavička `Permissions-Policy: geolocation=()`
  polohu zakazuje – rozpor i s textem privacy policy („rozhodujete o něm přímo
  v prohlížeči“).
- **Doporučení:** cílová politika (nasadit nejdřív jako
  `Content-Security-Policy-Report-Only`):

  ```
  default-src 'self';
  script-src 'self' https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self' https://*.ingest.de.sentry.io https://vitals.vercel-insights.com;
  frame-src https://umap.openstreetmap.fr;
  form-action 'self' https://formspree.io;
  base-uri 'self'; frame-ancestors 'self'; object-src 'none';
  ```

  Inline `onclick` nahradit `.js-contact-btn` posluchačem (stejný vzor jako
  `.js-donate-btn`); inline skripty buď hoistovat, nebo zapnout generování CSP
  hashů v Astru. Rozhodnout o geolokaci (odebrat `allow`, nebo povolit
  `geolocation=(self "https://umap.openstreetmap.fr")`). Zvážit `preload`
  v HSTS.

### S8 Údržba: duplicita CZ/EN stránek a texty natvrdo

- **Důkaz:** `src/pages/en/*` je kopie 13 českých stránek, diff tvoří jen
  cesty importů a několik textů. Divergence už nastala: CZ `index.astro` má
  recenze natvrdo, EN používá `t("home.reviews.*")`; CZ lightbox používá event
  delegation, EN per-button posluchače. `kontakty.astro`, `clanky.astro`,
  `404.astro`, `Footer.astro` a jejich EN protějšky mají texty natvrdo
  (v rozporu s `docs/AI_INSTRUCTIONS.md`). Testovací klíč `_test_fallback_key`
  je v produkčním `cs-CZ.json`.
- **Doporučení:** sdílené „view“ komponenty (`src/views/HomeView.astro` …)
  volané z tenkých CZ a EN stránek, nebo dynamická routa
  `src/pages/[...locale]/`; texty do slovníků; test fixture mimo produkční JSON.

### S9 Údržba: nepoužívané závislosti a mrtvý kód

- **Důkaz:** `@astrojs/react` + `react`/`react-dom`: ve `src/` není žádná
  `.tsx`/`.jsx` komponenta, build přesto emituje `dist/_astro/client.*.js`
  (191 KB React runtime, žádná stránka ho nenačítá). `@tolgee/web` se nikde
  neimportuje (architektura je headless). `ThemeToggle.astro`, `.dark-disabled`
  v `global.css` a inline „theme lockdown“ skript v `Layout.astro` jsou
  pozůstatek nedokončeného dark mode. `tsconfig.json` vylučuje neexistující
  `src/pages/en/404.astro`; `allowScripts` v `package.json` nemá pro npm efekt.
- **Doporučení:** odebrat `@astrojs/react`, `react`, `react-dom`, `@tolgee/web`
  a `jsx*` volby v `tsconfig.json`; rozhodnout o dark mode (dokončit, nebo
  smazat toggle, lockdown skript, `.dark-disabled` a `tests/dark-mode.spec.ts`
  přepsat); uklidit `tsconfig.json` a `package.json`.

### S10 SEO: nekonzistentní tvar URL a sitemap bez alternativ

- **Důkaz:** canonical `…/clanky/zmena-klimatu/` (s lomítkem), hreflang bez
  lomítka, sitemap s lomítkem (`Astro.url.pathname` vs. ruční ořez
  v `Layout.astro`). `sitemap-0.xml` nemá `xhtml:link` alternativy – integraci
  chybí volba `i18n`.
- **Doporučení:** `trailingSlash: "always"` (nebo `"never"`) v
  `astro.config.mjs` a stejná normalizace v `Layout.astro` i
  `LanguageDropdown.astro`; `sitemap({ i18n: { defaultLocale: "cs", locales: {
cs: "cs-CZ", en: "en" } } })`.

## 6. Nálezy – nízká priorita

- **N1 Formulář:** po odeslání Formspree přesměruje na vlastní stránku
  (návštěvník opustí web). Přidat skryté `_next` na děkovací stránku, nebo
  odesílat `fetch`em a zobrazit potvrzení v modalu; přidat honeypot `_gotcha`.
- **N2 Metadata prohlížeče:** viewport bez `initial-scale=1`; `favicon.ico`
  je ve skutečnosti PNG 150×150; chybí `apple-touch-icon`, SVG favicon,
  `theme-color` a web manifest.
- **N3 Strukturovaná data:** žádný JSON-LD. Přidat `Organization`/`NGO`
  (úvod, kontakty), `Article` (články), případně `Event`.
- **N4 Obsah 404 a odkazy:** 404 je jen česky i pro `/en/*`; 12× stejný
  odkaz „Číst dál“ bez kontextu – doplnit sr-only název článku.
- **N5 Pohyb:** `scroll-smooth` a animace bez `motion-safe:` neberou
  v úvahu `prefers-reduced-motion`.
- **N6 Rendering:** `will-change-transform` + `backdrop-blur` na každé kartě
  zbytečně zabírá GPU paměť na mobilech; `will-change` odebrat.
- **N7 Testy:** 5 „benchmark“ specifikací běží v 5 prohlížečích při každém CI
  (10 000 DOM prvků, měření času – flaky, bez regresní hodnoty);
  `tests/i18n.spec.ts` a `tests/lang.spec.ts` jsou unit testy bez tagu
  `@unit`, běží 5×; `tests/benchmark_i18n.ts` a `tests/unit/lang_performance.js`
  nespouští žádný runner. Chybí automatizovaný a11y test
  (`@axe-core/playwright`) – kontrastní chyby z S1 by zachytil.
- **N8 Git hook:** `.githooks/pre-push` se nikde neaktivuje (`core.hooksPath`
  nenastaven, chybí `prepare` skript). Při aktivaci by na každý push pouštěl
  celou Playwright sadu a auto-commitoval překlady. Čte klíč z proměnné
  `PUBLIC_TOLGEE_API_KEY` – prefix `PUBLIC_` v Astru znamená „smí do
  klientského bundlu“; přejmenovat na `TOLGEE_API_KEY`.
- **N9 CI:** akce nejsou pinované na SHA (`actions/checkout@v7`,
  `actions/setup-node@v6`); bez cache Playwright prohlížečů; chybí
  `CODEOWNERS` a PR template.
- **N10 Obsah:** poslední článek je z 30. 5. 2024; stránka podcastu má jen
  neaktivní placeholdery platforem; recenze jsou z roku 2023; odkaz GitHub na
  `/socialni-site` vede na `github.com/annazez/telperion-web`, repozitář je
  `telperion-nonprofit/web` (ověřit redirect); `README.md` má soukromý e-mail
  hned pod nadpisem.
- **N11 Dary:** číslo účtu je třikrát natvrdo (HTML a JS v
  `DonationModal.astro`, `kontakty.astro`), IBAN je v překladovém JSON – zavést
  jeden zdroj `src/data/organization.ts`. `removeEventListener(
"open-donation-modal", openModal)` nikdy nic neodebere (nová closure), při
  zapnutí View Transitions by se posluchače duplikovaly.
- **N12 Docs:** `docs/ARCHITECTURE.md` tvrdí „tolgee extract“ workflow,
  README „tolgee pull“ – sjednotit; doplnit, jak aktivovat hooky.

## 7. Co funguje dobře

- Statický build bez klientského frameworku; klientský JS na stránce ≈ 4 KB
  gzip (bez Sentry), QR knihovna 9 KB gzip se načítá až po otevření modalu.
- Obrázky přes `astro:assets` (WebP, `srcset`, `loading="lazy"`),
  click-to-load mapa, QR platba generovaná lokálně bez třetí strany,
  sanitizace SPD řetězce včetně testů.
- Soukromí: dokumentovaný cookie sken, Sentry bez Session Replay a PII,
  Vercel Analytics bez cookies, privacy policy v obou jazycích.
- CI: formát, lint, typy, unit testy, build a kontrola `<head>` pomocí parse5,
  e2e matrix 5 prohlížečů, Dependabot s bezpečným auto-merge (klasifikátor
  z base větve, `pull_request_target` bez checkoutu kódu PR).
- Bezpečnostní hlavičky v `vercel.json` existují (HSTS, nosniff,
  Referrer-Policy, Permissions-Policy, X-Frame-Options); zpřísnit je potřeba
  jen CSP.

## 8. Doporučený plán

| Sprint | Rozsah                                                                                                          | Odhad    |
| ------ | --------------------------------------------------------------------------------------------------------------- | -------- |
| 1      | V1 mapování překladů článků, V2 chybějící klíče + test, V3 `leaves.svg`, V4 odstranit modal, V5 metadata        | 1–2 dny  |
| 2      | S1–S4 přístupnost (kontrast, nadpisy, `<dialog>`, popisky), S5 lightbox, S6 fonty, S7 CSP Report-Only → enforce | 2–3 dny  |
| 3      | S8 sloučení CZ/EN, S9 závislosti a dark mode, S10 URL a sitemap, N7 testy, N8–N9 DX                             | průběžně |

## 9. K ručnímu ověření na produkci

```bash
# hlavičky (očekávání: CSP podle vercel.json, HSTS, X-Frame-Options)
curl -sI https://www.telperion.cz/ | grep -iE 'content-security|strict-transport|x-frame|permissions|referrer'

# V1: dnes očekáváno 404
curl -s -o /dev/null -w '%{http_code}\n' https://www.telperion.cz/en/articles/zmena-klimatu

# N10: přesměrování starého odkazu na GitHub
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://github.com/annazez/telperion-web
```

Dále: Vercel projekt (Node 24 podle `.nvmrc`, `PUBLIC_SENTRY_DSN` a
`SENTRY_AUTH_TOKEN`), Google Search Console (chyby hreflang, Core Web Vitals
na mobilu), Sentry (objem událostí).

## Příloha A – axe-core (WCAG 2.x A/AA + best practice)

| Scénář                      | Porušení                            |
| --------------------------- | ----------------------------------- |
| `/`                         | 0                                   |
| `/en/`                      | 0                                   |
| `/kontakty/`                | color-contrast ×13                  |
| `/en/contacts/`             | color-contrast ×13                  |
| `/clanky/`                  | color-contrast ×11                  |
| `/clanky/zmena-klimatu/`    | color-contrast ×1                   |
| `/programy/pro-skoly/`      | heading-order ×1                    |
| `/programy/pro-verejnost/`  | heading-order ×1                    |
| `/programy/dalsi-programy/` | color-contrast ×2, heading-order ×1 |
| `/podcast/`                 | 0                                   |
| `/socialni-site/`           | label-content-name-mismatch ×6      |
| `/ochrana-osobnich-udaju/`  | color-contrast ×1                   |
| `/404.html`                 | 0                                   |
| `/` + kontaktní modal       | 0                                   |
| `/` + darovací modal        | color-contrast ×1                   |
| `/` mobil + otevřené menu   | 0                                   |
| `/` + jazykové menu         | 0                                   |

Položky „incomplete“ (kontrast nad `backdrop-blur` kartami, 1–5 na stránku)
axe nedokáže spočítat automaticky; ruční kontrola hlavních kombinací je
v kapitole S1.

## Příloha B – Lighthouse 13 (mobilní emulace, lokální statický server)

| Stránka                  | Výkon | Přístupnost | Best practices | SEO | FCP   | LCP   | CLS   | Přenos | Požadavků |
| ------------------------ | ----- | ----------- | -------------- | --- | ----- | ----- | ----- | ------ | --------- |
| `/`                      | 78    | 100         | 96             | 100 | 2,7 s | 4,8 s | 0,009 | 697 KB | 18        |
| `/en/`                   | 81    | 100         | 96             | 100 | 2,4 s | 4,5 s | 0,016 | 653 KB | 16        |
| `/kontakty/`             | 76    | 95          | 96             | 100 | 1,4 s | 4,8 s | 0,149 | 691 KB | 23        |
| `/clanky/zmena-klimatu/` | 86    | 95          | 96             | 100 | 2,3 s | 3,9 s | 0,001 | 517 KB | 11        |

Největší položky přenosu na každé stránce: `leaves.*.svg` 311 KB,
`Layout.*.css` 54 KB (render-blocking, ~0,5 s), Playfair Display latin
38 KB + italic 38 KB, Manrope latin 24 KB.
