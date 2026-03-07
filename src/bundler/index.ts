import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;
let servicePromise: Promise<esbuild.Service> | null = null;

// Initialize esbuild service immediately
const initializeService = async () => {
  if (!service && !servicePromise) {
    servicePromise = esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
    service = await servicePromise;
  } else if (servicePromise) {
    service = await servicePromise;
  }
  return service;
};

// Start initialization immediately when module loads
initializeService();

const bundle = async (inputCode: string) => {
  try {
    // Wait for service to be ready
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
    return {
      bundledCode: result.outputFiles[0].text,
      err: "",
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        bundledCode: "",
        err: err.message,
      };
    } else {
      throw err;
    }
  }
};

export default bundle;
