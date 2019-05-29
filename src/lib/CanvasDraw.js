const fillRect = (width, height, imageData, rect, color) => {
	const x0 = rect[0] * 4;
	const y0 = rect[1] * width * 4;
	const x1 = rect[2] * 4;
	const y1 = rect[3] * width * 4;
	for (let x = x0; x < x1; x += 4) {
		for (let y = y0; y < y1; y += 4 * width) {
			const pos = x + y;
			for (let c = 0; c < color.length; c++) {
				imageData[pos + c] = color[c];
			}
		}
	}
};

const drawPattern = (width, height, imageData, cell, patterns, colors) => {
	const pattern = patterns[cell.patternIndex];
	const {mask} = pattern;
	let {x0, y0, x1, y1, filled} = cell;
	const foregroundColor = filled ? colors.filled : colors.notFilled;
	const backgroundColor = colors.backgroundColor;

	for (let x = x0; x < x1; x++) {
		for (let y = y0; y < y1; y++) {
			const dx = x * 4;
			const dy = y * 4 * width;
			const color = mask[y - y0][x - x0] === 1 ? foregroundColor : backgroundColor;
			const pos = dx + dy;
			for (let c = 0; c < color.length; c++) {
				imageData[pos + c] = color[c];
			}
		}
	}
};


const drawOnePattern = (pattern, imageData, colors) => {
	for (let y = 0; y < pattern.height; y++) {
		for (let x = 0; x < pattern.width; x++) {
			const dx = x * 4;
			const dy = y * 4 * pattern.width;
			const pos = dx + dy;
			const color = colors[pattern.mask[y][x]];
			for (let c = 0; c < color.length; c++) {
				imageData.data[pos + c] = color[c];
			}
		}
	}
};

const drawPatternColumnsWithContext = (imageWidth, imageHeight, ctx, columns, patterns, colors) => {
	// create pattern images
	const {filled, notFilled, backgroundColor} = colors;
	const patternImages = patterns.map(pattern => {
		const imageData0 = ctx.createImageData(pattern.width, pattern.height);
		drawOnePattern(pattern, imageData0, [backgroundColor, notFilled]);

		const imageData1 = ctx.createImageData(pattern.width, pattern.height);
		drawOnePattern(pattern, imageData1, [backgroundColor, filled]);

		return [imageData0, imageData1]
	});
	// blit patterns
	columns.forEach(column => column.forEach(cell => {
		const pData = patternImages[cell.patternIndex][cell.filled ? 1 : 0];
		ctx.putImageData(pData, cell.x0, cell.y0);
	}));
};

const drawPatternColumns = (imageWidth, imageHeight, imageData, columns, patterns, colors) => {
	columns.forEach(column => column.forEach(cell => {
		drawPattern(imageWidth, imageHeight, imageData, cell, patterns, colors);
	}));
};

const drawColumns = (imageWidth, imageHeight, imageData, columns) => {
	columns.forEach(column => column.forEach(cell => {
		const rect = [cell.x0, cell.y0, cell.x1, cell.y1];
		const color = cell.color;
		fillRect(imageWidth, imageHeight, imageData, rect, color);
	}));
};

const drawSingleColor = (imageWidth, imageHeight, imageData) => {
	const rect = [0, 0, imageWidth, imageHeight];
	fillRect(imageWidth, imageHeight, imageData, rect, [255, 0, 0, 255]);

};

export default {
	drawColumns,
	drawSingleColor,
	drawPatternColumns,
	drawPatternColumnsWithContext
};

