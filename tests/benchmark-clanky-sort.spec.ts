import { test, expect } from "@playwright/test";

test("Article Sorting Benchmark", async ({ page }) => {
  const numArticles = 1000;

  let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Sorting Benchmark</title>
    </head>
    <body>
  `;

  // Create mock data
  const articlesScript = `
    const articles = Array.from({ length: 1000 }, (_, i) => ({
      id: 'article-' + i + '.md',
      data: {
        title: 'Article ' + i,
        pubDate: new Date(Date.now() - Math.random() * 10000000000),
      }
    }));

    // Baseline (valueOf)
    performance.mark('start-valueOf');
    for (let i = 0; i < 1000; i++) {
      articles.slice().sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
    }
    performance.mark('end-valueOf');
    performance.measure('baseline-valueOf', 'start-valueOf', 'end-valueOf');

    // getTime()
    performance.mark('start-getTime');
    for (let i = 0; i < 1000; i++) {
      articles.slice().sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
    }
    performance.mark('end-getTime');
    performance.measure('optimized-getTime', 'start-getTime', 'end-getTime');

    // Schwartzian transform
    performance.mark('start-schwartzian');
    for (let i = 0; i < 1000; i++) {
      articles.slice()
        .map((article) => ({ article, time: article.data.pubDate.getTime() }))
        .sort((a, b) => b.time - a.time)
        .map((obj) => obj.article);
    }
    performance.mark('end-schwartzian');
    performance.measure('optimized-schwartzian', 'start-schwartzian', 'end-schwartzian');
  `;

  htmlContent += `
      <script>
        ${articlesScript}
      </script>
    </body>
    </html>
  `;

  await page.setContent(htmlContent);

  const valueOfDuration = await page.evaluate(() => {
    return performance.getEntriesByName("baseline-valueOf")[0].duration;
  });

  const getTimeDuration = await page.evaluate(() => {
    return performance.getEntriesByName("optimized-getTime")[0].duration;
  });

  const schwartzianDuration = await page.evaluate(() => {
    return performance.getEntriesByName("optimized-schwartzian")[0].duration;
  });

  const info = test.info();

  info.annotations.push({
    type: "benchmark",
    description: `Sorting ${numArticles} articles 1000 times: baseline (valueOf) = ${valueOfDuration.toFixed(2)} ms, getTime = ${getTimeDuration.toFixed(2)} ms, Schwartzian = ${schwartzianDuration.toFixed(2)} ms`,
  });

  const shouldLogBenchmark =
    process.env.BENCHMARK_LOG === "1" || process.env.BENCHMARK === "1";

  if (shouldLogBenchmark) {
    console.log(
      `[BASELINE (valueOf)] Sorting ${numArticles} articles 1000 times took: ${valueOfDuration.toFixed(2)} ms`,
    );
    console.log(
      `[OPTIMIZED (getTime)] Sorting ${numArticles} articles 1000 times took: ${getTimeDuration.toFixed(2)} ms`,
    );
    console.log(
      `[OPTIMIZED (Schwartzian)] Sorting ${numArticles} articles 1000 times took: ${schwartzianDuration.toFixed(2)} ms`,
    );

    const improvementGetTime = valueOfDuration - getTimeDuration;
    const improvementSchwartzian = valueOfDuration - schwartzianDuration;

    console.log(
      `[IMPROVEMENT (getTime)] ${improvementGetTime.toFixed(2)} ms (${((improvementGetTime / valueOfDuration) * 100).toFixed(2)}%)`,
    );
    console.log(
      `[IMPROVEMENT (Schwartzian)] ${improvementSchwartzian.toFixed(2)} ms (${((improvementSchwartzian / valueOfDuration) * 100).toFixed(2)}%)`,
    );
  }
});
