import { useState } from "react";
import CodeEditor from "components/code-editor/code-editor";
import Preview from "components/preview/preview";
import bundle from "../../bundler";

const CodeCell: React.FC = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");

  const onClick = async () => {
    const bundledCode = await bundle(input);
    setCode(bundledCode);
  };

  const handleEditorChange = (value: string) => {
    setInput(value);
  };

  return (
    <div className="">
      <CodeEditor
        onChange={handleEditorChange}
        initialValue="//start writing your code!"
      />
      <div className="">
        <button onClick={onClick}>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;
