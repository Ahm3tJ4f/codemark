import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef, useState } from "react";
import "./text-editor.css";
const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [MDText, setMDText] = useState("# header");
  const refTextEditor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const isInsideEditor = (refTextEditor.current &&
        refTextEditor.current.contains(event.target as Node)) as boolean;

      setEditing(isInsideEditor);
    };
    document.addEventListener("click", listener, { capture: true });

    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  const handleClick = () => {
    setEditing(true);
  };

  return (
    <div className="text-editor card" onClick={handleClick}>
      {editing ? (
        <div ref={refTextEditor}>
          <MDEditor
            value={MDText}
            onChange={(value) => {
              setMDText(value || "");
            }}
          />
        </div>
      ) : (
        <div className="card-content">
          <MDEditor.Markdown source={MDText} />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
