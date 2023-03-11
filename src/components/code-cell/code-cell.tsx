import { useEffect, useState } from "react";
import CodeEditor from "components/code-editor/code-editor";
import Preview from "components/preview/preview";
import bundle from "../../bundler";
import Resizable from "components/resizable/resizable";

const CodeCell: React.FC = () => {
  const [input, setInput] = useState("");
  const [bundledCode, setBundledCode] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const executionTimer = setTimeout(async () => {
      const bundleOutput = await bundle(input);
      setBundledCode(bundleOutput.bundledCode);
      setErr(bundleOutput.err);
    }, 500);

    return () => {
      clearTimeout(executionTimer);
    };
  }, [input]);

  const handleEditorChange = (value: string) => {
    setInput(value);
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            onChange={handleEditorChange}
            initialValue={"const a = 1;"}
          />
        </Resizable>
        <Preview code={bundledCode} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
