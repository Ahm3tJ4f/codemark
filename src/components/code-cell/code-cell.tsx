import { useEffect, useState } from "react";
import CodeEditor from "components/code-editor/code-editor";
import Preview from "components/preview/preview";
import bundle from "../../bundler";
import Resizable from "components/resizable/resizable";
const CodeCell: React.FC = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const executionTimer = setTimeout(async () => {
      const bundledCode = await bundle(input);
      setCode(bundledCode);
    }, 1500);

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
            initialValue="//start writing your code!"
          />
        </Resizable>
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
