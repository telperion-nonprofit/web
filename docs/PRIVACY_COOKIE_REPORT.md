# Privacy and cookie scan report

Datum kontroly: 2026-07-04

Tento report shrnuje technický sken repozitáře a navazující webové ověření
zdrojů pro stránku ochrany osobních údajů. Není to advokátní stanovisko; je to
pracovní compliance podklad k aktuálnímu stavu webu.

## Rozsah skenu

Kontrolované oblasti:

- `src`, `public`, konfigurace Astro/Vercel, testy a dokumentace.
- Vyhledávání cookies, Web Storage, externích skriptů, iframe, formulářů,
  analytiky, plateb/darů, externích domén a kontaktů.
- Manuální čtení klíčových souborů: `Layout.astro`, `Footer.astro`,
  `Navbar.astro`, `Modal.astro`, `DonationModal.astro`, úvodní stránky,
  kontakty, jazykový routing a konfigurace Vercelu.

## Nálezy v kódu

Web je statický Astro web deployovaný přes Vercel adapter. Nejsou tu uživatelské
účty, newsletter, komentáře, e-shop ani vlastní backend s databází.

Aktivní datové toky:

- Hosting a provozní logy: Vercel, implicitně přes deploy a `@astrojs/vercel`.
- Analytika a výkon: `@vercel/analytics` a `@vercel/speed-insights` jsou vložené
  v `src/layouts/Layout.astro`.
- Technické sledování chyb: `@sentry/astro` je přidané v `astro.config.mjs`.
  SDK běží jen v prohlížeči a jen v buildech na Vercelu (produkce a preview),
  ne při lokálním vývoji ani v CI testech. Konfigurace vypíná Sentry Session
  Replay, neposílá IP adresu, cookies ani údaje o uživateli
  (`dataCollection`), výchozí performance tracing má sampling `0` a source
  mapy se uploadují jen při nastavení `SENTRY_AUTH_TOKEN`. Události jdou do projektu
  `telperion-zs-x4` / `sentry-chestnut-clock` (region EU, `de.sentry.io`).
- Kontaktní formulář: `src/components/Modal.astro` odesílá jméno, e-mail,
  volitelný telefon, program, jazyk a zprávu na `https://formspree.io/f/xyknzgwp`.
- Mapa: úvodní stránka má click-to-load iframe z
  `https://umap.openstreetmap.fr/...`; mapa se načítá až po kliknutí na
  tlačítko pro načtení mapy. Web zároveň nepoužívá preconnect na uMap ani
  OpenStreetMap tile servery před kliknutím.
- Dary: `DonationModal.astro` generuje QR platbu lokálně v prohlížeči a odkazuje
  na transparentní účet Fio. Výběr částky sám o sobě neposílá data na server.
- Externí odkazy: samostatná stránka sociálních sítí odkazuje na Instagram,
  LinkedIn, Facebook, YouTube a GitHub; další externí odkazy vedou na Fio,
  Climate Fresk a Plant-for-the-Planet. Nejde o embed sociálních widgetů.

Browser storage:

- Vlastní kód nenastavuje `document.cookie`.
- `sessionStorage.climateFreskModalSeen` ukládá zavření eventového popupu pro
  aktuální relaci.
- `localStorage.zvoleny-jazyk` se v aktuálním kódu pouze čte ve formuláři, aby
  případně předvyplnil jazyk. V repozitáři jsem nenašel aktivní zápis této
  hodnoty.
- `ThemeToggle.astro` obsahuje zápis `localStorage.theme`, ale komponenta je v
  navbaru zakomentovaná a aktuálně se nerenderuje.

## Síťové ověření

Přes `curl -I -L` bylo 2026-07-04 ověřeno:

- uMap iframe může po kliknutí na načtení mapy odpovědět hlavičkou
  `Set-Cookie` pro technickou cookie `csrftoken` s přibližně roční expirací.
  Jde o cookie domény `umap.openstreetmap.fr`, ne o marketingovou cookie
  Telperionu.
- Formspree endpoint při přímém dotazu odpovídá cookie `fs_ab1=control` na
  doméně `formspree.io`. Na webu Telperion se tato doména kontaktuje až při
  odeslání formuláře.

## Právní a provider zdroje

- ÚOOÚ Cookies: https://uoou.gov.cz/cookies
- ÚOOÚ informace o zpracování osobních údajů:
  https://uoou.gov.cz/informace-o-zpracovani-osobnich-udaju
- ÚOOÚ PDF "webové stránky":
  https://uoou.gov.cz/media/informace-o-zpracovani-osobnich-udaju/7-informace-o-zpracovani-osobnich-udaju-web-vcetne-odberu-novinek.pdf
- GDPR, zejména čl. 13 a čl. 6:
  https://eur-lex.europa.eu/legal-content/CS/TXT/HTML/?uri=CELEX:32016R0679
- Vercel Web Analytics privacy:
  https://vercel.com/docs/analytics/privacy-policy
- Vercel Speed Insights privacy:
  https://vercel.com/docs/speed-insights/privacy-policy
- Formspree privacy: https://formspree.io/legal/privacy-policy/
- Sentry Astro SDK docs: https://docs.sentry.io/platforms/javascript/guides/astro/
- Sentry Privacy Policy: https://sentry.io/privacy/
- Sentry Data Processing Addendum: https://sentry.io/legal/dpa/
- uMap about: https://umap.openstreetmap.fr/cs-cz/about/
- OpenStreetMap Foundation privacy: https://osmfoundation.org/wiki/Privacy_Policy
- OpenStreetMap France legal notice:
  https://www.openstreetmap.fr/mentions-legales/
- ARES ověření správce:
  https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/21104271

## Závěr ke cookie notice / cookie choice

Aktuální web nepotřebuje plnohodnotný cookie banner s volbou souhlasu pro
marketingové nebo analytické cookies, protože:

- vlastní kód Telperionu nenastavuje cookies,
- nejsou zde reklamní pixely, remarketing, Hotjar/Clarity ani sociální embedy,
- Vercel Web Analytics podle dokumentace nepoužívá third-party cookies a slouží
  k agregované statistice,
- Sentry je v aktuální konfiguraci použité pro technické hlášení chyb bez
  Session Replay a bez marketingového nebo profilovacího použití,
- zjištěná uMap cookie je technická cookie poskytovatele vložené mapy, která
  může vzniknout až po kliknutí na načtení mapy,
- `sessionStorage` se používá jen pro zapamatování zavření popupu v relaci.

Je ale nutné mít jasnou informaci o zpracování osobních údajů a cookies/podobných
technologiích. Ta je doplněna do privacy policy a odkazována z footeru.

Mapa je nově řešená jako click-to-load: nenačítá se automaticky při scrollu, ale
až po kliknutí na tlačítko. To snižuje automatický kontakt se třetí stranou a
riziko third-party iframe cookies před aktivní volbou návštěvníka.

Cookie banner nebo consent management bude potřeba přidat, pokud se později
nasadí např. Google Analytics s cookies, Meta/TikTok/LinkedIn pixel, Hotjar,
Microsoft Clarity, reklamní remarketing, personalizace, newsletter tracking,
embedovaná videa/sociální widgety načítaná automaticky, Sentry Session Replay,
vyšší performance tracing/RUM nad rámec technického error monitoringu, nebo jiná
volitelná technologie čtená/ukládaná v prohlížeči před souhlasem.

## Implementované změny

- Přidána česká privacy policy: `/ochrana-osobnich-udaju`.
- Přidána anglická privacy policy: `/en/privacy-policy`.
- Doplněné mapování jazykové routy pro privacy policy.
- Doplněné odkazy do footeru.
- Sjednocena adresa spolku v kontaktech podle ARES:
  `Úvozová 261/6, 252 62 Únětice`.
- Doplněna Sentry konfigurace přes env proměnné a zmínky o technickém error
  monitoringu do privacy policy.
- Vložená uMap/OpenStreetMap mapa je přepnutá na click-to-load a privacy policy
  popisuje načtení mapy až po kliknutí.
- Sociální odkazy byly přesunuté z footeru na samostatnou stránku. Jsou to
  běžné externí odkazy bez embedů.

## K potvrzení

- Zda má Telperion pověřence pro ochranu osobních údajů. V policy není uveden,
  protože pro něj v repozitáři není podklad.
- Zda je `info@telperion.cz` správný kontakt pro uplatnění GDPR práv.
- Zda chcete ponechat retenci dotazů/poptávek jako "maximálně 3 roky od poslední
  komunikace, pokud zákon nevyžaduje déle".
- Zda existují uzavřené DPA/smlouvy se zpracovateli Vercel a Formspree, případně
  jestli chcete Formspree nahradit vlastním formulářem nebo EU providerem.
- Zda existuje nebo bude uzavřený DPA vztah se Sentry a jak dlouho chcete v
  Sentry uchovávat chybové události.
- Po větších změnách mapového embeddu znovu ověřit, zda se třetí strana
  nenačítá před kliknutím.
