import { test, expect } from "@playwright/test";

test("LanguageDropdown Initialization Benchmark", async ({ page }) => {
  // We'll create a page with 10,000 language dropdowns to measure the init time.
  const numDropdowns = 10000;

  // Set up the HTML content
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

  // The client script to execute and measure (baseline version)
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

  // The client script to execute and measure (optimized version)
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

  // Retrieve the measurement
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
