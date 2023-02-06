import "bulmaswatch/superhero/bulmaswatch.min.css";
import * as ReactDOM from "react-dom";
import CodeCell from "components/code-cell/code-cell";
const App: React.FC = () => {
  return (
    <div>
      <CodeCell />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
