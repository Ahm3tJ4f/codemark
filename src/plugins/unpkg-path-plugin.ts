import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      //handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return {
          path: "index.js",
          namespace: "a",
        };
      });
      // handle relative paths in modules
      build.onResolve({ filter: /^\.+\// }, (args) => {
        const newURL = new URL(
          args.path,
          "https://unpkg.com" + args.resolveDir + "/"
        );
        return {
          namespace: "a",
          path: newURL.href,
        };
      });
      // handle requested file in module
      build.onResolve({ filter: /.*/ }, async (args) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
