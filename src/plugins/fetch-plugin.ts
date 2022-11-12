import * as esbuild from "esbuild-wasm";
import localForage from "localforage";
import axios from "axios";

const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (input: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args) => {
        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: input,
          };
        }
        // eslint-disable-next-line prettier/prettier
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);
        fileCache.setItem(args.path, data);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
