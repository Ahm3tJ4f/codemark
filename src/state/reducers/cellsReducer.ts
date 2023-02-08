/* eslint-disable no-case-declarations */
import { ActionType } from "state/action-types";
import { Action } from "state/actions";
import { Cell, CellTypes } from "state/cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const reducer = (
  state: CellsState = initialState,
  action: Action
): CellsState => {
  switch (action.type) {
    case ActionType.DELETE_CELL:
      return state;

    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      return {
        ...state,
        data: { ...state.data, [id]: { ...state.data[id], content } },
      };

    case ActionType.MOVE_CELL:
      return state;

    case ActionType.INSERT_CELL_BEFORE:
      return state;

    default:
      return state;
  }
  return state;
};

export default reducer;

const stateEx: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {
    salam: {
      id: "salam",
      type: "code",
      content: "asdasfsaf",
    },
  },
};
