import "bulmaswatch/superhero/bulmaswatch.min.css";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import CodeCell from "components/code-cell/code-cell";
import { store } from "state";
//import TextEditor from "components/text-editor/text-editor";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <CodeCell />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
