# 🌿 Telperion Web – Mladí učí o klimatu

[![Astro](https://img.shields.io/badge/Vytvořeno_v-Astro-ff5a03?style=flat&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Testováno_v-Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Vítejte v repozitáři pro nový web iniciativy **Telperion**. 

Jsme studenti, kteří informují o tématech spojených s životním prostředím a přibližují udržitelný způsob života mladé generaci. Naším přístupem je **dialog namísto strašení, ověřená fakta a interaktivita**.

🌐 **[Odkaz na produkční web]** *(bude doplněno po spuštění)*

---

## 💡 Vize projektu (Proč nový web?)

Tato verze vznikla jako kompletní náhrada našeho původního řešení (postaveného na těžkopádných page-builderech), které již nevyhovovalo našim standardům a potřebám. Zaměřili jsme se na tři hlavní pilíře:

1. **🌳 Ekologická udržitelnost:** Odstranili jsme nadbytečný kód a databáze. Nový web využívá Statickou Generaci Stránek (SSG), nezatěžuje zbytečně servery a radikálně snižuje uhlíkovou stopu každého načtení.
2. **⚡ Blesková rychlost:** Původní doba načítání se pohybovala kolem 14 vteřin. Díky moderní architektuře a optimalizaci se nyní web načítá prakticky okamžitě.
3. **🎨 Moderní design:** Implementovali jsme čistý, responzivní design inspirovaný přírodou, využívající prvky "glassmorphismu" (průhledné vrstvy) pro elegantní a vzdušný dojem.

## 🛠️ Použité technologie

Projekt je postaven na moderním webovém stacku, který zaručuje maximální výkon, bezpečnost a snadnou údržbu:

* [**Astro**](https://astro.build/) – Náš hlavní framework. Generuje extrémně rychlé statické stránky bez zbytečného JavaScriptu na straně klienta.
* [**Tailwind CSS**](https://tailwindcss.com/) – Utility-first CSS framework, který nám umožňuje rychle vytvářet a udržovat náš unikátní designový systém.
* [**TypeScript**](https://www.typescriptlang.org/) – Přidává typovou bezpečnost pro spolehlivější a čistší kód.
* [**Playwright**](https://playwright.dev/) – Nástroj pro automatizované End-to-End (E2E) testování. Stará se o to, aby nové změny nerozbily důležité funkce webu.

## 🚀 Jak spustit projekt lokálně

Chcete nám pomoct s vývojem nebo si projekt jen prohlédnout u sebe na počítači? Je to jednoduché! Stačí mít nainstalované [Node.js](https://nodejs.org/).

```bash
# 1. Naklonování repozitáře
git clone [https://github.com/annazez/telperion-web.git](https://github.com/annazez/telperion-web.git)

# 2. Přechod do složky projektu
cd telperion-web

# 3. Instalace všech potřebných závislostí
npm install

# 4. Spuštění lokálního vývojového serveru
npm run dev
