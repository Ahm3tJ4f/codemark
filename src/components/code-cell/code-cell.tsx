import { useEffect, useState } from "react";
import CodeEditor from "components/code-editor/code-editor";
import Preview from "components/preview/preview";
import bundle from "../../bundler";
import Resizable from "components/resizable/resizable";
const CodeCell: React.FC = () => {
  const fractalTreeCode = `import ReactDOM from "react-dom";
import React, { useRef, useEffect } from "react";

const FractalTree = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const drawTree = (x1, y1, angle, depth) => {
      if (depth !== 0) {
        const x2 = x1 + Math.cos(angle) * depth * 7.0;
        const y2 = y1 + Math.sin(angle) * depth * 8.0;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        drawTree(x2, y2, angle - 50, depth - 1);
        drawTree(x2, y2, angle + 50, depth - 1);
      }
    };

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height);
    drawTree(55, 0, 11, 10);
    ctx.restore();
  }, []);

  return <canvas ref={canvasRef} width={600} height={450} />;
};

  ReactDOM.render(<FractalTree />, document.getElementById("root"));`;

  const [input, setInput] = useState(fractalTreeCode);
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
            initialValue={fractalTreeCode}
          />
        </Resizable>
        <Preview code={bundledCode} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
