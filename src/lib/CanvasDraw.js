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

const drawColumns = (imageWidth, imageHeight, imageData) => (dispatch, getState) => {
	const columns = getState().columns;
	columns.forEach(column => column.forEach(cell => {
		const rect = [cell.x0, cell.y0, cell.x1, cell.y1];
		const color = cell.color;
		fillRect(imageWidth, imageHeight, imageData, rect, color);
	}));
};

export default {
	drawColumns,
};

