import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CodeEditor from "components/code-editor/code-editor";
import Preview from "components/preview/preview";
import bundle from "../../bundler";
import Resizable from "components/resizable/resizable";
import { updateCell } from "state/action-creators";
import { RootState } from "state/reducers";

interface CodeCellProps {
  id: string;
}

const CodeCell: React.FC<CodeCellProps> = ({ id }) => {
  const dispatch = useDispatch();
  const cell = useSelector((state: RootState) => state.cells?.data[id]);
  const [bundledCode, setBundledCode] = useState("");
  const [err, setErr] = useState("");
  const [hasBundledInitially, setHasBundledInitially] = useState(false);

  const content = cell?.content || "";

  useEffect(() => {
    if (!content.trim()) {
      return;
    }

    // For initial bundle (no debounce)
    if (!hasBundledInitially) {
      const bundleImmediately = async () => {
        const bundleOutput = await bundle(content);
        setBundledCode(bundleOutput.bundledCode);
        setErr(bundleOutput.err);
        setHasBundledInitially(true);
      };
      bundleImmediately();
      return;
    }

    // For subsequent changes (with debounce)
    const executionTimer = setTimeout(async () => {
      const bundleOutput = await bundle(content);
      setBundledCode(bundleOutput.bundledCode);
      setErr(bundleOutput.err);
    }, 500);

    return () => {
      clearTimeout(executionTimer);
    };
  }, [content, hasBundledInitially]);

  const handleEditorChange = (value: string) => {
    dispatch(updateCell(id, value));
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            key={id}
            onChange={handleEditorChange}
            initialValue={content}
          />
        </Resizable>
        <Preview code={bundledCode} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
