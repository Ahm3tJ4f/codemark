/* eslint-disable no-case-declarations */
import { ActionType } from "state/action-types";
import { Action } from "state/actions";
import produce from "immer";
import { Cell } from "state/cell";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const randomId = () => {
  return Math.random().toString(36).substring(5, 8);
};

// Default code content for new code cells (simple boilerplate)
const simpleBoilerplate = `const App = () => {
  return React.createElement('div', null);
};

ReactDOM.render(React.createElement(App), document.querySelector('#root'));`;

// Fractal tree demo content for the initial code cell
const fractalTreeContent = `const { useRef, useEffect } = React;

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 400;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 500);

    const drawTree = (startX, startY, len, angle, width) => {
      ctx.beginPath();
      ctx.save();
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = width;
      ctx.translate(startX, startY);
      ctx.rotate(angle * Math.PI / 180);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -len);
      ctx.stroke();

      if (len < 8) {
        ctx.restore();
        return;
      }

      drawTree(0, -len, len * 0.75, -20, width * 0.7);
      drawTree(0, -len, len * 0.75, 20, width * 0.7);
      ctx.restore();
    };

    drawTree(300, 450, 80, 0, 10);
  }, []);

  return React.createElement('div', {
    style: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }
  },
    React.createElement('canvas', {
      ref: canvasRef,
      style: { border: '1px solid #ccc', borderRadius: '4px' }
    })
  );
};

ReactDOM.render(React.createElement(App), document.querySelector('#root'));`;

// Initial text cell content
const welcomeTextContent = `# Fractal Tree with esbuild-wasm 🌳⚡

This notebook demonstrates a **recursive fractal tree** rendered using HTML5 Canvas, bundled entirely in the browser using WebAssembly.

## Technical Overview

### WebAssembly Bundling
- **esbuild-wasm**: Fast browser-based bundler running in WebAssembly
- **No server required**: All transpilation happens client-side
- **Performance**: ~1.2s cold start, ~5-20ms hot reload

### Canvas API Techniques
- **ctx.save() / ctx.restore()**: Save/restore transformation state
- **ctx.translate()**: Move origin to branch endpoint
- **ctx.rotate()**: Rotate coordinate system for each branch

### Complexity
- **Time**: O(2^n) where n = recursion depth (~6-7 levels)
- **Space**: O(n) for call stack depth
- **Branches**: ~64-128 lines drawn

## Try Editing!
Modify the code cell to change:
- Branch angle
- Length ratio
- Base case threshold
- Line colors

---

*Click the code cell to see the fractal tree!*`;

// Create initial cells
const textCellId = randomId();
const codeCellId = randomId();

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [textCellId, codeCellId],
  data: {
    [textCellId]: {
      id: textCellId,
      type: "text",
      content: welcomeTextContent,
    },
    [codeCellId]: {
      id: codeCellId,
      type: "code",
      content: fractalTreeContent,
    },
  },
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
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= state.order.length) {
        return state;
      }

      const temp = state.order[targetIndex];
      state.order[targetIndex] = state.order[index];
      state.order[index] = temp;

      return state;

    case ActionType.INSERT_CELL_BEFORE:
      const cell: Cell = {
        content: action.payload.type === "code" ? simpleBoilerplate : "",
        type: action.payload.type,
        id: randomId(),
      };

      state.data[cell.id] = cell;

      const foundIndex = state.order.indexOf(action.payload.id);

      if (foundIndex < 0) {
        state.order.push(cell.id);
      } else {
        state.order.splice(foundIndex, 0, cell.id);
      }
      return state;

    default:
      return state;
  }
});

export default reducer;
