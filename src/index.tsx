import "bulmaswatch/superhero/bulmaswatch.min.css";
import * as ReactDOM from "react-dom";
// import CodeCell from "components/code-cell/code-cell";
import TextEditor from "components/text-editor/text-editor";

const App: React.FC = () => {
  return (
    <div>
      <TextEditor />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
