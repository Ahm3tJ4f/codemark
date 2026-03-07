import { useDispatch, useSelector } from "react-redux";
import { insertCellBefore } from "state/action-creators";
import { RootState } from "state/reducers";
import { CellTypes } from "state/cell";
import CellListItem from "../cell-list-item/cell-list-item";
import "./cell-list.css";

const CellList: React.FC = () => {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => state.cells?.order || []);

  const handleAddCode = () => {
    // Use empty string to add at the end
    dispatch(insertCellBefore("", "code" as CellTypes));
  };

  const handleAddText = () => {
    dispatch(insertCellBefore("", "text" as CellTypes));
  };

  const renderedCells = order.map((id) => {
    return <CellListItem key={id} id={id} />;
  });

  return (
    <div className="cell-list">
      {renderedCells}
      {order.length === 0 && (
        <div className="empty-state">
          <h3>No cells yet</h3>
          <p>Click the buttons below to add your first cell.</p>
        </div>
      )}
      <div className="add-cell-bar">
        <button className="button is-primary" onClick={handleAddCode}>
          + Add Code
        </button>
        <button className="button is-info" onClick={handleAddText}>
          + Add Text
        </button>
      </div>
    </div>
  );
};

export default CellList;
