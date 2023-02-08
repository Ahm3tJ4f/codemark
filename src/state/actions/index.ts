import { ActionType } from "state/action-types";
import { CellTypes } from "state/cell";

export type DirectionTypes = "up" | "down";
export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: DirectionTypes;
  };
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

export interface InsertCellBeforeAction {
  type: ActionType.INSERT_CELL_BEFORE;
  payload: { id: string; type: CellTypes };
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: { id: string; content: string };
}

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | UpdateCellAction
  | InsertCellBeforeAction;
