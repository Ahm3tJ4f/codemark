import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { recordBenchmark } from "../utils/benchmark";

export interface BundleResult {
  bundledCode: string;
  err: string;
}

export interface PerformanceMetrics {
  wasmInitTime: number;
  bundleTime: number;
  totalTime: number;
}

let service: esbuild.Service;
let servicePromise: Promise<esbuild.Service> | null = null;
let wasmInitStart: number = 0;
let wasmInitComplete: number = 0;

const initializeService = async () => {
  if (!service && !servicePromise) {
    wasmInitStart = performance.now();
    servicePromise = esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
    service = await servicePromise;
    wasmInitComplete = performance.now();
    console.log(
      `%c🚀 WebAssembly Initialized: ${(
        wasmInitComplete - wasmInitStart
      ).toFixed(2)}ms`,
      "color: #10b981; font-weight: bold; font-size: 14px;"
    );
  } else if (servicePromise) {
    service = await servicePromise;
  }
  return service;
};

initializeService();

const bundle = async (
  inputCode: string,
  logPerformance: boolean = true
): Promise<BundleResult & { metrics?: PerformanceMetrics }> => {
  const bundleStart = performance.now();
  try {
    const esbuildService = await initializeService();

    const result = await esbuildService.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [fetchPlugin(inputCode), unpkgPathPlugin()],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
      external: ["react", "react-dom"],
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
    });

    const bundleEnd = performance.now();
    const bundleTime = bundleEnd - bundleStart;
    const wasmInitTime = wasmInitComplete - wasmInitStart;
    const bundleSize = result.outputFiles[0].text.length;

    if (logPerformance) {
      console.log(
        `%c⚡ Bundle Time: ${bundleTime.toFixed(2)}ms`,
        "color: #3b82f6; font-weight: bold;"
      );
      console.log(
        `%c📦 Bundle Size: ${(bundleSize / 1024).toFixed(2)} KB`,
        "color: #8b5cf6; font-weight: bold;"
      );
    }

    recordBenchmark(wasmInitTime, bundleTime, bundleSize, inputCode.length);

    return {
      bundledCode: result.outputFiles[0].text,
      err: "",
      metrics: {
        wasmInitTime,
        bundleTime,
        totalTime: wasmInitTime + bundleTime,
      },
    };
  } catch (err) {
    const bundleEnd = performance.now();
    const wasmInitTime = wasmInitComplete - wasmInitStart;
    if (err instanceof Error) {
      return {
        bundledCode: "",
        err: err.message,
        metrics: {
          wasmInitTime,
          bundleTime: bundleEnd - bundleStart,
          totalTime: wasmInitTime + (bundleEnd - bundleStart),
        },
      };
    } else {
      throw err;
    }
  }
};

export const getWasmInitTime = () => wasmInitComplete - wasmInitStart;

export default bundle;
