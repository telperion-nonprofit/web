import { test, expect } from "@playwright/test";

test("LanguageDropdown Initialization Benchmark", async ({ page }) => {
  const numDropdowns = 10000;

  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Benchmark</title>
    </head>
    <body>
  `;

  for (let i = 0; i < numDropdowns; i++) {
    htmlContent += `
      <div class="relative language-dropdown-container inline-block">
        <button type="button" class="language-toggle flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium transition-colors text-dark-green hover:text-brand-green rounded-full hover:bg-white/50" aria-expanded="false" aria-haspopup="true">
          <div class="flex items-center gap-2">
            <span class="current-language-label">EN</span>
          </div>
        </button>
        <div class="language-menu hidden absolute z-50 overflow-hidden glass-card rounded-2xl shadow-xl transition-all duration-200 right-0 mt-2 w-40 origin-top-right" role="menu" aria-orientation="vertical">
          <div class="p-2 flex flex-col gap-1">
            <a href="/" class="lang-option flex w-full items-center px-4 py-2.5 text-sm text-dark-green font-medium hover:bg-brand-green/10 hover:text-brand-green rounded-xl transition-all duration-200" role="menuitem">Čeština</a>
            <a href="/en/" class="lang-option flex w-full items-center px-4 py-2.5 text-sm text-dark-green font-medium hover:bg-brand-green/10 hover:text-brand-green rounded-xl transition-all duration-200" role="menuitem">English</a>
          </div>
        </div>
      </div>
    `;
  }

  const scriptContentBaseline = `
    performance.mark('start-init-baseline');
    const containerElements1 = document.querySelectorAll(
      ".language-dropdown-container",
    );

    const dropdowns1 = Array.from(containerElements1).map((container) => ({
      container: container,
      toggle: container.querySelector(
        ".language-toggle",
      ),
      menu: container.querySelector(".language-menu"),
    }));
    performance.mark('end-init-baseline');
    performance.measure('init-baseline', 'start-init-baseline', 'end-init-baseline');
  `;

  const scriptContentOptimized = `
    performance.mark('start-init-optimized');
    const containerElements2 = document.querySelectorAll(
      ".language-dropdown-container",
    );

    const dropdowns2 = [];
    for (let i = 0; i < containerElements2.length; i++) {
      const container = containerElements2[i];
      dropdowns2.push({
        container,
        toggle: container.querySelector(
          ".language-toggle",
        ),
        menu: container.querySelector(".language-menu"),
      });
    }
    performance.mark('end-init-optimized');
    performance.measure('init-optimized', 'start-init-optimized', 'end-init-optimized');
  `;

  htmlContent += `
      <script>
        ${scriptContentBaseline}
        ${scriptContentOptimized}
      </script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  const baselineDuration = await page.evaluate(() => {
    return performance.getEntriesByName("init-baseline")[0].duration;
  });
  const optimizedDuration = await page.evaluate(() => {
    return performance.getEntriesByName("init-optimized")[0].duration;
  });

  const info = test.info();
  const improvementMs = baselineDuration - optimizedDuration;
  const improvementPct = (improvementMs / baselineDuration) * 100;

  info.annotations.push({
    type: "benchmark",
    description:
      `Initialization of ${numDropdowns} dropdowns: ` +
      `baseline=${baselineDuration.toFixed(2)} ms, ` +
      `optimized=${optimizedDuration.toFixed(2)} ms, ` +
      `improvement=${improvementMs.toFixed(2)} ms (${improvementPct.toFixed(2)}%)`,
  });

  const shouldLogBenchmark =
    process.env.BENCHMARK_LOG === "1" || process.env.BENCHMARK === "1";

  if (shouldLogBenchmark) {
    console.log(
      `[BASELINE] Initialization of ${numDropdowns} dropdowns took: ${baselineDuration.toFixed(2)} ms`,
    );
    console.log(
      `[OPTIMIZED] Initialization of ${numDropdowns} dropdowns took: ${optimizedDuration.toFixed(2)} ms`,
    );
    console.log(
      `[IMPROVEMENT] ${improvementMs.toFixed(2)} ms (${improvementPct.toFixed(2)}%)`,
    );
  }
});

test("LanguageDropdown Click and Click-Outside Benchmark", async ({ page }) => {
  const numDropdowns = 10000;

  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Benchmark</title>
    </head>
    <body id="body">
  `;

  for (let i = 0; i < numDropdowns; i++) {
    htmlContent += `
      <div class="relative language-dropdown-container inline-block">
        <button type="button" class="language-toggle flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium transition-colors text-dark-green hover:text-brand-green rounded-full hover:bg-white/50" aria-expanded="false" aria-haspopup="true">
          <div class="flex items-center gap-2">
            <span class="current-language-label">EN</span>
          </div>
        </button>
        <div class="language-menu hidden absolute z-50 overflow-hidden glass-card rounded-2xl shadow-xl transition-all duration-200 right-0 mt-2 w-40 origin-top-right" role="menu" aria-orientation="vertical">
          <div class="p-2 flex flex-col gap-1">
            <a href="/" class="lang-option flex w-full items-center px-4 py-2.5 text-sm text-dark-green font-medium hover:bg-brand-green/10 hover:text-brand-green rounded-xl transition-all duration-200" role="menuitem">Čeština</a>
            <a href="/en/" class="lang-option flex w-full items-center px-4 py-2.5 text-sm text-dark-green font-medium hover:bg-brand-green/10 hover:text-brand-green rounded-xl transition-all duration-200" role="menuitem">English</a>
          </div>
        </div>
      </div>
    `;
  }

  // The client script for baseline event handling
  const scriptContentBaselineEvents = `
    const containerElements = document.querySelectorAll(
      ".language-dropdown-container",
    );

    const dropdowns = [];
    for (let i = 0; i < containerElements.length; i++) {
      const container = containerElements[i];
      dropdowns.push({
        container,
        toggle: container.querySelector(
          ".language-toggle",
        ),
        menu: container.querySelector(".language-menu"),
      });
    }

    window.clickToggleBaseline = (index) => {
      performance.mark('start-click-baseline');
      const { container, toggle, menu } = dropdowns[index];
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";

      dropdowns.forEach((otherDropdown) => {
        if (otherDropdown.container !== container) {
          const { toggle: otherToggle, menu: otherMenu } = otherDropdown;
          if (otherToggle && otherMenu) {
            otherToggle.setAttribute("aria-expanded", "false");
            otherMenu.classList.add("hidden");
            otherToggle.classList.remove("group");
          }
        }
      });

      toggle.setAttribute("aria-expanded", String(!isExpanded));
      menu.classList.toggle("hidden");
      toggle.classList.toggle("group");
      performance.mark('end-click-baseline');
      performance.measure('click-baseline', 'start-click-baseline', 'end-click-baseline');
    };

    window.clickOutsideBaseline = (targetElement) => {
      performance.mark('start-outside-baseline');
      dropdowns.forEach(({ container, toggle, menu }) => {
        if (toggle && menu && !container.contains(targetElement)) {
          toggle.setAttribute("aria-expanded", "false");
          menu.classList.add("hidden");
          toggle.classList.remove("group");
        }
      });
      performance.mark('end-outside-baseline');
      performance.measure('outside-baseline', 'start-outside-baseline', 'end-outside-baseline');
    };
  `;

  // The client script for optimized event handling
  const scriptContentOptimizedEvents = `
    let activeDropdown = null;

    window.clickToggleOptimized = (index) => {
      performance.mark('start-click-optimized');
      const dropdown = dropdowns[index];
      const { toggle, menu } = dropdown;
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";

      if (activeDropdown && activeDropdown !== dropdown) {
        activeDropdown.toggle.setAttribute("aria-expanded", "false");
        activeDropdown.menu.classList.add("hidden");
        activeDropdown.toggle.classList.remove("group");
      }

      toggle.setAttribute("aria-expanded", String(!isExpanded));
      menu.classList.toggle("hidden");
      toggle.classList.toggle("group");

      if (!isExpanded) {
         activeDropdown = dropdown;
      } else {
         activeDropdown = null;
      }

      performance.mark('end-click-optimized');
      performance.measure('click-optimized', 'start-click-optimized', 'end-click-optimized');
    };

    window.clickOutsideOptimized = (targetElement) => {
      performance.mark('start-outside-optimized');
      if (activeDropdown) {
          const { container, toggle, menu } = activeDropdown;
          if (!container.contains(targetElement)) {
             toggle.setAttribute("aria-expanded", "false");
             menu.classList.add("hidden");
             toggle.classList.remove("group");
             activeDropdown = null;
          }
      }
      performance.mark('end-outside-optimized');
      performance.measure('outside-optimized', 'start-outside-optimized', 'end-outside-optimized');
    };
  `;

  htmlContent += `
      <script>
        ${scriptContentBaselineEvents}
        ${scriptContentOptimizedEvents}
      </script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  // Measure baseline
  const [clickBaseline, outsideBaseline] = await page.evaluate(() => {
    window.clickToggleBaseline(0);
    window.clickOutsideBaseline(document.getElementById("body"));
    return [
      performance.getEntriesByName("click-baseline")[0].duration,
      performance.getEntriesByName("outside-baseline")[0].duration,
    ];
  });

  // Reset states manually just in case
  await page.evaluate(() => {
    performance.clearMarks();
    performance.clearMeasures();
  });

  // Measure optimized
  const [clickOptimized, outsideOptimized] = await page.evaluate(() => {
    window.clickToggleOptimized(1);
    window.clickOutsideOptimized(document.getElementById("body"));
    return [
      performance.getEntriesByName("click-optimized")[0].duration,
      performance.getEntriesByName("outside-optimized")[0].duration,
    ];
  });

  const shouldLogBenchmark =
    process.env.BENCHMARK_LOG === "1" || process.env.BENCHMARK === "1";

  if (shouldLogBenchmark) {
    console.log(
      `[BASELINE CLICK] Opening dropdown among ${numDropdowns} took: ${clickBaseline.toFixed(2)} ms`,
    );
    console.log(
      `[OPTIMIZED CLICK] Opening dropdown among ${numDropdowns} took: ${clickOptimized.toFixed(2)} ms`,
    );
    console.log(
      `[BASELINE OUTSIDE] Clicking outside among ${numDropdowns} took: ${outsideBaseline.toFixed(2)} ms`,
    );
    console.log(
      `[OPTIMIZED OUTSIDE] Clicking outside among ${numDropdowns} took: ${outsideOptimized.toFixed(2)} ms`,
    );
  }
});
