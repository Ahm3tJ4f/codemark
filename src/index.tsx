import { useState, useEffect, useRef } from "react";
import * as ReactDOM from "react-dom";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "plugins/unpkg-path-plugin";
import { fetchPlugin } from "plugins/fetch-plugin";
import CodeEditor from "components/code-editor/code-editor";

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const iframe = useRef<any>();
  const ref = useRef<any>();

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    iframe.current.srcdoc = html;

    //bundling
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [fetchPlugin(input), unpkgPathPlugin()],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
  };

  const handleChange = (value: string) => {
    setInput(value);
  };

  const html = `
  <html>
    <head>
    </head>
    <body>
      <div id="root"></div>
      <script>
        window.addEventListener("message", (event)=> {
         try{
          eval(event.data)
         } catch (err) {
          console.log(err)
          const root = document.querySelector("#root");
          root.innerHTML = '<div style="color: #b80000;"><h4>Runtime Error</h4>' + err + '</div>';
         }
        })
      </script>
    </body>
  </html>
    `;

  return (
    <div className="">
      <CodeEditor
        onChange={handleChange}
        initialValue="//start writing your dream code!"
      />
      <div className="">
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe
        title="codePreview"
        srcDoc={html}
        ref={iframe}
        sandbox="allow-scripts"
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
