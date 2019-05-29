import {createSlice, createSelector} from "redux-starter-kit";
import pattern from "../lib/pattern";
import CanvasDraw from '../lib/CanvasDraw'


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
	let a = [];
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
		// exitMax--;
	}
	return a;
};

const getNewColumns = (nbrOfColumns, maxWidth, maxHeight, patterns) => Array(nbrOfColumns).fill([]).map((emptyCol, colIndex) => createColumn(colIndex, maxWidth, maxHeight, patterns));

const thresholdFunction = (color, threshold) => {
	const colorSum = color[0] + color[1] + color[2];
	const average = colorSum / 3;
	return average < threshold;
};

const updateWithThreshold = (state, action) => {
	state.columns = state.columns.map(column => column.map(cell => {
		return {
			...cell,
			filled: thresholdFunction(cell.color, state.threshold)
		}
	}));
};

const setImageDimensions = (state, action) => {
	state.imageWidth = action.payload.width;
	state.imageHeight = action.payload.height;
};

const setThreshold = (state, action) => {
	state.threshold = action.payload;
};

const setColumns = (state, action) => {
	state.columns = action.payload;
};

const setColor = (state, action) => {
	const {colorId, color: {r, g, b}} = action.payload;
	state.colors[colorId] = [r, g, b, 255];
};

const initPatterns = (state, action) => {
	const patternWidth = action.payload;
	state.patterns = [pattern.newCirclePattern('circle', patternWidth), pattern.newBarPattern('bar', patternWidth)];
};

const incrementCount = (state, action) => {
	state.count++;
};

const initialState = {
	imageWidth: 0,
	imageHeight: 0,
	columns: [],
	patternWidth: 0,
	patterns: [],
	threshold: 127,
	colors: {
		filled: [24, 65, 74, 255],
		notFilled: [54, 170, 192, 255],
		backgroundColor: [83, 201, 224, 255],

	},
	count: 0
};

export const assemble = createSlice({
	slice: 'assemble',
	initialState,
	reducers: {
		// init,
		updateWithThreshold,
		togglePattern,
		setImageDimensions,
		setThreshold,
		setColumns,
		initPatterns,
		setColor,
		incrementCount,
	}
});
const rgbToHex = function (rgb) {
	let hex = Number(rgb).toString(16);
	if (hex.length < 2) {
		hex = "0" + hex;
	}
	return hex;
};
const fullColorHex = function (colorArray) {
	const [r, g, b] = colorArray;
	const red = rgbToHex(r);
	const green = rgbToHex(g);
	const blue = rgbToHex(b);
	return red + green + blue;
};
assemble.selectors = {
	getImageDimensions: createSelector(
		['assemble.imageWidth', 'assemble.imageHeight'],
		(imageWidth, imageHeight) => {
			return {imageWidth, imageHeight};
		}
	),
	getColors: createSelector(
		['assemble.colors'],
		(colors) => {
			const colorsCopy = {...colors};
			return Object.keys(colorsCopy).reduce((obj, key) => {
				obj[key] = '#' + fullColorHex(obj[key]);
				return obj;
			}, colorsCopy)
		}
	),
	getCount: createSelector(
		['assemble.count'],
		(count) => {
			return count;
		}
	)
};

// Thunks
export const initWithImageData = (imageData) => (dispatch, getState) => {

	let state = getState().assemble;
	const patternWidth = Math.round(state.imageWidth / 52);
	dispatch(assemble.actions.initPatterns(patternWidth));

	state = getState().assemble;

	const nbrOfColumns = Math.ceil(state.imageWidth / state.patterns[0].width);
	let columns = getNewColumns(nbrOfColumns, state.imageWidth, state.imageHeight, state.patterns);
	columns = getRgbColumns(columns, state.patterns, state.imageWidth, state.imageHeight, imageData);
	dispatch(assemble.actions.setColumns(columns));
	dispatch(assemble.actions.incrementCount());
};

export const drawBlocksImage = (imageData) => (dispatch, getState) => {
	const state = getState().assemble;
	CanvasDraw.drawColumns(state.imageWidth, state.imageHeight, imageData, state.columns);
};

export const drawPatternImage = (imageData) => (dispatch, getState) => {
	dispatch(assemble.actions.updateWithThreshold());
	const state = getState().assemble;
	CanvasDraw.drawPatternColumns(state.imageWidth, state.imageHeight, imageData, state.columns, state.patterns, state.colors);
};

export const drawPatternImageWithContext = (ctx) => (dispatch, getState) => {
	dispatch(assemble.actions.updateWithThreshold());
	const state = getState().assemble;
	CanvasDraw.drawPatternColumnsWithContext(state.imageWidth, state.imageHeight, ctx, state.columns, state.patterns, state.colors);
};

export const updateColor = (colorId, color) => {
	const thunk = (dispatch, getState) => {
		dispatch(assemble.actions.setColor({colorId, color}));
		dispatch(assemble.actions.incrementCount());
	};

	thunk.meta = {
		debounce: {
			time: 100,
			key: 'updateColor' + colorId
		}
	};
	return thunk;
};

export const updateThreshold = (threshold) => {
	const thunk = (dispatch, getState) => {
		dispatch(assemble.actions.setThreshold(threshold));
		dispatch(assemble.actions.incrementCount());
	};

	thunk.meta = {
		debounce: {
			time: 100,
			key: 'updateThreshold '
		}
	};
	return thunk;
};