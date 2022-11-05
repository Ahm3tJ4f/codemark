import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
    name: 'filecache'
})
export const unpkgPathPlugin = () => {
    return {
        name: 'unpkg-path-plugin',
        setup(build: esbuild.PluginBuild) {
            build.onResolve({ filter: /.*/ }, async (args: any) => {
                if (args.path === 'index.js') {
                    return {
                        path: args.path, namespace: 'a'
                    };
                }

                if (args.path.includes('./') || args.path.includes('../')) {
                    const newURL = new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
                    return {
                        namespace: 'a',
                        path: newURL.href,
                    }
                }
                return {
                    namespace: 'a',
                    path: `https://unpkg.com/${args.path}`,
                }
            });

            build.onLoad({ filter: /.*/ }, async (args: any) => {
                if (args.path === 'index.js') {
                    return {
                        loader: 'jsx',
                        contents: `import { useState } from 'nested-test-pkg'`,
                    };
                }

                const cachedResult = await fileCache.getItem(args.path);

                if (cachedResult) {
                    return cachedResult
                }

                const { data, request } = await axios.get(args.path);
                fileCache.setItem(args.path, data)
                const fileDir = new URL('./', request.responseURL).pathname;

                const result: esbuild.OnLoadResult = {
                    loader: 'jsx',
                    contents: data,
                    resolveDir: fileDir,
                }
                fileCache.setItem(args.path, result);

                return result;
            });
        },
    };
};