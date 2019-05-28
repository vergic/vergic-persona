const outerDiameter = 25;
const innerDiameter = 12;//13;
const diameterRatio = innerDiameter / outerDiameter;

const patternTemplate = {
	id: 'id',
	selected: true,
	width: 0,
	height: 0,
	mask: [],
};

const emptyRow = (size) => {
	return Array(size).fill(0);
};

// Vergic circle math function
const circleCalc = (x, y, size) => {
	const outerRadius = (size / 2);
	const innerRadius = outerRadius * diameterRatio;
	const dx = (size / 2) - x;
	const dy = (size / 2) - y;
	const dist = Math.sqrt(dx * dx + dy * dy);
	return dist > innerRadius && dist < outerRadius ? 1 : 0;
};

// Vergic bar math function
const barCalc = (x, y, w, h, b) => {
	return (x < b || y < b || x > w - b || y > h - b) ? 0 : 1;
};

// Vergic bar math function
const _barCalc = (x, y, w, h) => {
	return (x === 0 || y === 0 || x === w - 1 || y === h - 1) ? 0 : 1;
};

// Create Vergic circle pattern
const newCirclePattern = (id, size) => {
	const mask = Array(size).fill([]).map(empty => emptyRow(size))
		.map((row, y) => row.map((val, x) => circleCalc(x, y, size - 1)));
	return {
		...patternTemplate,
		id,
		width: size,
		height: size + 2,
		mask: [emptyRow(size), ...mask, emptyRow(size)]
	};
};

// Create Vergic bar pattern
const newBarPattern = (id, size) => {
	const height = outerDiameter - innerDiameter;
	const mask = Array(height).fill([]).map(empty => emptyRow(size))
		.map((row, y) => row.map((val, x) => barCalc(x, y, size, height, 2)));

	return {
		...patternTemplate,
		id,
		width: size,
		height: height + 2,
		mask: [emptyRow(size), ...mask, emptyRow(size)]
	};
};

// export default pattern;
export default {
	newCirclePattern,
	newBarPattern
};




