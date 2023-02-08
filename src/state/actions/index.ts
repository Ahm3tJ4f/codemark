import { ActionType } from "state/action-types";
import { CellTypes } from "state/cell";

interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: "up" | "down";
  };
}

interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

interface InsertCellBeforeAction {
  type: ActionType.INSERT_CELL_BEFORE;
  payload: { id: string; type: CellTypes };
}

interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: { id: string; content: "string" };
}

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | UpdateCellAction
  | InsertCellBeforeAction;
