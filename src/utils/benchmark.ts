export interface BenchmarkResult {
  timestamp: string;
  wasmInitTime: number;
  bundleTime: number;
  bundleSize: number;
  codeLength: number;
}

const benchmarkHistory: BenchmarkResult[] = [];

export const recordBenchmark = (
  wasmInitTime: number,
  bundleTime: number,
  bundleSize: number,
  codeLength: number
) => {
  const result: BenchmarkResult = {
    timestamp: new Date().toISOString(),
    wasmInitTime,
    bundleTime,
    bundleSize,
    codeLength,
  };
  benchmarkHistory.push(result);
  return result;
};

export const getBenchmarkHistory = () => [...benchmarkHistory];

export const exportBenchmarkJSON = () => {
  const data = JSON.stringify(benchmarkHistory, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `esbuild-wasm-benchmarks-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const getSummaryStats = () => {
  if (benchmarkHistory.length === 0) return null;

  const bundleTimes = benchmarkHistory.map((r) => r.bundleTime);
  const bundleSizes = benchmarkHistory.map((r) => r.bundleSize);

  return {
    totalBenchmarks: benchmarkHistory.length,
    avgBundleTime:
      bundleTimes.reduce((a, b) => a + b, 0) / benchmarkHistory.length,
    minBundleTime: Math.min(...bundleTimes),
    maxBundleTime: Math.max(...bundleTimes),
    avgBundleSize:
      bundleSizes.reduce((a, b) => a + b, 0) / benchmarkHistory.length,
    wasmInitTime: benchmarkHistory[0].wasmInitTime,
  };
};

console.log(
  "%c📈 Performance Benchmarking Enabled!",
  "color: #10b981; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cUse window.getBenchmarkHistory() to get all records",
  "color: #6b7280;"
);
console.log("%cUse window.getSummaryStats() for summary", "color: #6b7280;");
console.log(
  "%cUse window.exportBenchmarkJSON() to download results",
  "color: #6b7280;"
);

(window as any).getBenchmarkHistory = getBenchmarkHistory;
(window as any).getSummaryStats = getSummaryStats;
(window as any).exportBenchmarkJSON = exportBenchmarkJSON;
(window as any).recordBenchmark = recordBenchmark;
