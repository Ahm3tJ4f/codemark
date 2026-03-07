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
    
    const drawTree = (startX, startY, length, angle, branchWidth, color1, color2) => {
      ctx.beginPath();
      ctx.save();
      ctx.strokeStyle = color1;
      ctx.fillStyle = color2;
      ctx.lineWidth = branchWidth;
      ctx.translate(startX, startY);
      ctx.rotate(angle * Math.PI/180);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -length);
      ctx.stroke();

      if (length < 10) {
        ctx.restore();
        return;
      }

      drawTree(0, -length, length * 0.8, -15, branchWidth * 0.8, color1, color2);
      drawTree(0, -length, length * 0.8, 15, branchWidth * 0.8, color1, color2);
      
      ctx.restore();
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTree(300, 400, 100, 0, 12, 'brown', 'green');
  }, []);

  return React.createElement('div', { 
    style: { display: 'flex', justifyContent: 'center', alignItems: 'center' } 
  }, 
    React.createElement('canvas', {
      ref: canvasRef,
      width: 600,
      height: 500,
      style: { border: '1px solid #ddd', backgroundColor: '#f5f5f5' }
    })
  );
};

ReactDOM.render(React.createElement(App), document.querySelector('#root'));`;

// Initial text cell content
const welcomeTextContent = `# Welcome to CodeMark! 🎨🌳

This notebook demonstrates a **recursive fractal tree** implementation using HTML5 Canvas and React hooks.

## How It Works

The fractal tree below is generated using a **recursive algorithm** that:

1. **Starts with a trunk** - Draws a vertical line from the bottom center
2. **Creates branches** - At the end of each line, splits into two new branches at ±15° angles
3. **Recedes gradually** - Each branch is 80% of the length of its parent
4. **Stops at threshold** - When branch length < 10px, it stops recursing (creating the leaves)

## Key Concepts

- **Recursion**: The \`drawTree\` function calls itself to create branches
- **Canvas API**: Uses \`ctx.save()\`, \`ctx.translate()\`, and \`ctx.rotate()\` to transform the drawing context
- **React Hooks**: \`useRef\` to access the canvas, \`useEffect\` to draw when component mounts

---

*Click the code cell below to see the implementation!*`;

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
