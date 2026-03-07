import { useDispatch, useSelector } from "react-redux";
import {
  moveCell,
  deleteCell,
  insertCellBefore,
  updateCell,
} from "state/action-creators";
import { RootState } from "state/reducers";
import { CellTypes } from "state/cell";
import CodeCell from "components/code-cell/code-cell";
import TextEditor from "components/text-editor/text-editor";
import "./cell-list-item.css";

interface CellListItemProps {
  id: string;
}

const CellListItem: React.FC<CellListItemProps> = ({ id }) => {
  const dispatch = useDispatch();
  const cell = useSelector((state: RootState) => state.cells?.data[id]);

  if (!cell) {
    return null;
  }

  const handleMoveUp = () => {
    dispatch(moveCell(id, "up"));
  };

  const handleMoveDown = () => {
    dispatch(moveCell(id, "down"));
  };

  const handleDelete = () => {
    dispatch(deleteCell(id));
  };

  const handleInsertCode = () => {
    dispatch(insertCellBefore(id, "code" as CellTypes));
  };

  const handleInsertText = () => {
    dispatch(insertCellBefore(id, "text" as CellTypes));
  };

  return (
    <div className="cell-list-item">
      <div className="action-bar">
        <div className="action-buttons">
          <button
            className="button is-small is-primary"
            onClick={handleMoveUp}
            title="Move Up"
          >
            <span className="icon">▲</span>
          </button>
          <button
            className="button is-small is-primary"
            onClick={handleMoveDown}
            title="Move Down"
          >
            <span className="icon">▼</span>
          </button>
          <button
            className="button is-small is-danger"
            onClick={handleDelete}
            title="Delete"
          >
            <span className="icon">×</span>
          </button>
        </div>
        <div className="insert-buttons">
          <button
            className="button is-small is-info"
            onClick={handleInsertText}
            title="Add Text Cell Above"
          >
            + Text
          </button>
          <button
            className="button is-small is-info"
            onClick={handleInsertCode}
            title="Add Code Cell Above"
          >
            + Code
          </button>
        </div>
      </div>
      <div className="cell-content">
        {cell.type === "code" ? (
          <CodeCell id={id} />
        ) : (
          <TextEditor
            content={cell.content}
            onChange={(value) => {
              dispatch(updateCell(id, value));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CellListItem;
