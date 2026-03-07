import "bulmaswatch/superhero/bulmaswatch.min.css";
import "./styles/global.css";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import CellList from "components/cell-list/cell-list";
import { store } from "state";
import "./utils/benchmark";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
      </div>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
