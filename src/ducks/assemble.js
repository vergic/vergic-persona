import {createSlice, createSelector} from "redux-starter-kit";
import pattern from "../lib/pattern";


const togglePattern = (state, action) => {
	state.patterns[action.payload.id].selected = !state.patterns[action.payload.id].selected;
};


const getRect = (width, height, d, rect) => {
	const x0 = rect[0] * 4;
	const y0 = rect[1] * width * 4;
	const x1 = rect[2] * 4;
	const y1 = rect[3] * width * 4;
	let a = [];
	for (let x = x0; x < x1; x += 4) {
		for (let y = y0; y < y1; y += 4 * width) {
			const pos = x + y;
			for (let c = 0; c < 4; c++) {
				a.push(d[pos + c]);
			}
		}
	}
	return a;
};

const getAverageRgb = (a) => {
	let rgbaSum = [0, 0, 0, 0];
	for (let i = 0; i < a.length; i += 4) {
		for (let c = 0; c < rgbaSum.length; c++) {
			rgbaSum[c] += a[i + c];
		}
	}
	const nrOfValues = a.length / 4;
	for (let c = 0; c < rgbaSum.length; c++) {
		rgbaSum[c] = Math.round(rgbaSum[c] / nrOfValues);
	}
	return rgbaSum;
};

const getRgbColumns = (columns, patterns, imageWidth, imageHeight, imageData) => {
	return columns.map((column) => column.map((cell) => {
		const rect = [cell.x0, cell.y0, cell.x1, cell.y1];
		const rectData = getRect(imageWidth, imageHeight, imageData, rect);
		const color = getAverageRgb(rectData);
		return {
			...cell,
			color
		};
	}));
};

const createColumn = (colIndex, maxWidth, maxHeight, patterns) => {
	let a = [0];
	let y0 = 0;
	let y1 = 0;
	const patternWidth = patterns[0].width;
	const x0 = colIndex * patternWidth;
	const x1 = Math.min(x0 + patternWidth, maxWidth);
	let exitMax = 100;
	while (y1 < maxHeight && exitMax > 0) {
		const patternIndex = Math.floor(Math.random() * patterns.length);
		const pattern = patterns[patternIndex];
		y1 = Math.min(y0 + pattern.height, maxHeight);
		const cell = {
			patternIndex,
			color: [0, 0, 0, 0],
			filled: false,
			x0,
			y0,
			x1,
			y1,
		};
		a.push(cell);
		y0 = y1;
		exitMax--;
	}
	return a;
};

const getNewColumns = (nbrOfColumns, maxWidth, maxHeight, patterns) => Array(nbrOfColumns).fill([]).map((emptyCol, colIndex) => createColumn(colIndex, maxWidth, maxHeight, patterns));

/**
 *
 * @param state
 * @param action payload = imageData, width, height
 */
const init = (state, action) => {
	const {imageData, width, height} = action.payload;
	state.imageWidth = width;
	state.imageHeight = height;

	// init patterns
	state.patterns = [pattern.newCirclePattern('circle', width), pattern.newBarPattern('bar', width)];

	// init new columns
	const nbrOfColumns = Math.ceil(action.payload.width / state.patternWidth);
	const columns = getNewColumns(nbrOfColumns, width, height, state.patterns);

	// set color
	state.columns = getRgbColumns(columns, state.patterns, width, height, imageData);
};

const thresholdFunction = (color, threshold) => {
	const colorSum = color[0] + color[1] + color[2];
	const average = colorSum / 3;
	return average < threshold;
};

const initialState = {
	imageWidth: 0,
	imageHeight: 0,
	columns: [],
	patternWidth: 0,
	patterns: [],
	threshold: 127
};

const updateWithThreshold = (state, action) => {
	state.columns = state.columns.map(column => column.map(cell => {
		return {
			...cell,
			filled: thresholdFunction(cell.color, state.threshold)
		}
	}));
};


const assemble = createSlice({
	slice: 'assemble',
	initialState,
	reducers: {
		init,
		updateWithThreshold,
		togglePattern,
	}
});

// not used
assemble.selectors.getFiltered = createSelector(
	['columns', 'threshold'],
	(columns, threshold) => {
		return columns.map(column => column.map(cell => thresholdFunction(cell.color, threshold)));
	}
);

export default assemble;


