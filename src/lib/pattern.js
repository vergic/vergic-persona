const outerDiameter = 25;
const innerDiameter = 12;//13;
const diameterRatio = innerDiameter / outerDiameter;
const barWidth = 22.7;
const barHeight = 5.5;
const barPadding = 2.8;
const verticalPaddingRatio = barPadding / barHeight;
const barRatio = barHeight / barWidth;

const patternTemplate = {
	id: 'id',
	selected: true,
	width: 0,
	height: 0,
	mask: [],
};

const emptyRow = (size, value = 0) => {
	return Array(size).fill(value);
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

const addPadding = (mask, width, horizPadding, vertPadding) => {
	vertPadding = Array(vertPadding).fill([]).map(empty => emptyRow(width));
	horizPadding = Array(horizPadding).fill(0);
	return [...mask.map(row => row.concat(horizPadding)), ...vertPadding];
};

// Create Vergic circle pattern
const newCirclePattern = (id, width, horizPadding = 2) => {
	const widthWithoutPadding = width - horizPadding;
	const vertSize = Math.round(widthWithoutPadding * barRatio);
	const vertPadding = Math.round(vertSize * verticalPaddingRatio);

	const mask = Array(widthWithoutPadding).fill([]).map(empty => emptyRow(widthWithoutPadding))
		.map((row, y) => row.map((val, x) => circleCalc(x, y, widthWithoutPadding)));

	return {
		...patternTemplate,
		id,
		width,
		height: widthWithoutPadding + vertPadding,
		mask: addPadding(mask, width, horizPadding, vertPadding)
	};
};

// Create Vergic bar pattern
const newBarPattern = (id, width, horizPadding = 2) => {
	const widthWithoutPadding = width - horizPadding;
	const vertSize = Math.round(widthWithoutPadding * barRatio);
	const vertPadding = Math.round(vertSize * verticalPaddingRatio);
	const horizSize = width - horizPadding;

	const mask = Array(vertSize).fill([]).map(empty => emptyRow(horizSize, 1));

	return {
		...patternTemplate,
		id,
		width,
		height: Math.round(vertSize + vertPadding),
		mask: addPadding(mask, width, horizPadding, vertPadding)
	};
};

// export default pattern;
export default {
	newCirclePattern,
	newBarPattern
};




