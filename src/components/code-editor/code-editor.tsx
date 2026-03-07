import "./code-editor.css";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { useRef, useEffect } from "react";
interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

// eslint-disable-next-line react/prop-types
const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== initialValue) {
        editorRef.current.setValue(initialValue);
      }
    }
  }, [initialValue]);

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.setValue(initialValue);
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
  };

  const onFormatClick = () => {
    const unformattedCode = editorRef.current.getModel().getValue();
    const formattedCode = prettier.format(unformattedCode, {
      parser: "babel",
      plugins: [parser],
      semi: true,
      singleQuote: false,
    });
    editorRef.current.setValue(formattedCode);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        theme="dark"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        language="javascript"
        height="100%"
      />
    </div>
  );
};

export default CodeEditor;
