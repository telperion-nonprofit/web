const { performance } = require('perf_hooks');

// Generate some dates
const dates = Array.from({ length: 10000 }, () => new Date(Date.now() - Math.random() * 10000000000));

// Benchmark 1: Uncached
function formatDateUncached(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

const startUncached = performance.now();
for (let i = 0; i < dates.length; i++) {
  formatDateUncached(dates[i]);
}
const endUncached = performance.now();
const uncachedTime = endUncached - startUncached;


// Benchmark 2: Cached
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function formatDateCached(date) {
  return formatter.format(date);
}

const startCached = performance.now();
for (let i = 0; i < dates.length; i++) {
  formatDateCached(dates[i]);
}
const endCached = performance.now();
const cachedTime = endCached - startCached;

console.log(`Uncached time: ${uncachedTime.toFixed(2)}ms`);
console.log(`Cached time: ${cachedTime.toFixed(2)}ms`);
console.log(`Improvement: ${((uncachedTime - cachedTime) / uncachedTime * 100).toFixed(2)}% faster`);
