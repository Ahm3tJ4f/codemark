import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef, useState } from "react";
import "./text-editor.css";

interface TextEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, onChange }) => {
  const [editing, setEditing] = useState(false);
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
            value={content}
            onChange={(value) => {
              onChange(value || "");
            }}
          />
        </div>
      ) : (
        <div className="card-content">
          <MDEditor.Markdown source={content} />
        </div>
      )}
    </div>
  );
};

export default TextEditor;
