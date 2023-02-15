/* eslint-disable no-case-declarations */
import { ActionType } from 'state/action-types';
import { Action } from 'state/actions';
import produce from 'immer';
import { Cell } from 'state/cell';

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

const reducer = produce((state: CellsState = initialState, action: Action) => {
	switch (action.type) {
		case ActionType.DELETE_CELL:
			state.order = state.order.filter((id) => id !== action.payload);
			delete state.data[action.payload];
			return state;

		case ActionType.UPDATE_CELL:
			const { id, content } = action.payload;
			state.data[id].content = content;
			return state;

		case ActionType.MOVE_CELL:
			const { direction } = action.payload;
			const index = state.order.indexOf(action.payload.id);
			const targetIndex = direction === 'up' ? index - 1 : index + 1;
			const targetId = state.order[targetIndex];

			if (targetIndex < 0 || targetIndex > state.order.length) {
				return state;
			}

			state.order[targetIndex] = state.order[index];
			state.order[index] = targetId;

			return state;

		case ActionType.INSERT_CELL_BEFORE:
			const cell: Cell = {
				content: '',
				type: action.payload.type,
				id: randomId(),
			};

			state.data[cell.id] = cell;

			const foundIndex = state.order.indexOf(action.payload.id);

			if (foundIndex < 0) {
				state.order.push(action.payload.id);
			} else {
				state.order.splice(foundIndex, 0, cell.id);
			}

			return state;

		default:
			return state;
	}
});

const randomId = () => {
	return Math.random().toString(36).substring(5, 8);
};

export default reducer;
