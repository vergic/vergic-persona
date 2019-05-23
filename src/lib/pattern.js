const outerDiameter = 25;
const innerDiameter = 13;
const diameterRatio = innerDiameter / outerDiameter;

const patternTemplate = {
	id: 'id',
	selected: false,
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
const barCalc = (x, y, w, h) => {
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
		height: size,
		mask
	};
};

// Create Vergic bar pattern
const newBarPattern = (id, size) => {
	const height = Math.round((size / 2) * diameterRatio) + 2;
	size += 2;
	const mask = Array(height).fill([]).map(empty => emptyRow(size))
		.map((row, y) => row.map((val, x) => barCalc(x, y, size, height)));

	return {
		...patternTemplate,
		id,
		width: size,
		height,
		mask
	};
};

// export default pattern;
export default {
	newCirclePattern,
	newBarPattern
};




