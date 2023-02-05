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
      //handle root entry file of 'index.js'
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: input,
        };
      });

      //load cached file
      build.onLoad({ filter: /.*/ }, async (args) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });

      //handle CSS file
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);
        fileCache.setItem(args.path, data);
        const escapedData = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
          const style = document.createElement('style');
          style.innerText = '${escapedData}';
          document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        fileCache.setItem(args.path, result);
        return result;
      });

      //handle JS file
      build.onLoad({ filter: /.*/ }, async (args) => {
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
