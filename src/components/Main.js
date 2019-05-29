import React, {useRef, useState, useEffect} from "react";
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {PhotoshopPicker} from 'react-color'
import ColorView from './ColorView'
import ImageContainer from './ImageContainer'
import ThresholdSlider from './ThresholdSlider'
import {
	assemble,
	initWithImageData,
	drawBlocksImage,
	drawPatternImage,
	drawPatternImageWithContext,
	updateColor
} from '../ducks/assemble'
import {view, restart} from '../ducks/view'

const Main = () => {

	const dispatch = useDispatch();
	const init = (imageData) => dispatch(initWithImageData(imageData));

	const [pickerOpen, setPickerOpen] = useState('');
	const color = useSelector(assemble.selectors.getColors, shallowEqual)[pickerOpen] || '';
	const setColor = (colorId, color) => dispatch(updateColor(colorId, color));

	const togglePicker = (colorId) => {
		const p = pickerOpen === colorId
			? ''
			: colorId;

		setPickerOpen(p);
	};

	const startOver = () => {
		dispatch(restart());
	};

	const count = useSelector(assemble.selectors.getCount, shallowEqual);
	useEffect(
		() => {
			console.log('draw');
			drawPatternsWithContext();
			return () => console.log('clean');
		}, [count]);

	const imageLoaded = () => {
		const {imageWidth, imageHeight} = canvasDimensions;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		ctx.canvas.width = imageWidth;
		ctx.canvas.height = imageHeight;
		drawOriginal();
		const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);
		init(imageData.data);
	};

	const drawOriginal = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const img = document.getElementById('orig');
		ctx.drawImage(img, 0, 0);
	};

	const drawBlocks = () => {
		const {imageWidth, imageHeight} = canvasDimensions;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);
		dispatch(drawBlocksImage(imageData.data));
		ctx.putImageData(imageData, 0, 0);
	};

	const drawPatterns = () => {
		const {imageWidth, imageHeight} = canvasDimensions;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);
		dispatch(drawPatternImage(imageData.data));
		ctx.putImageData(imageData, 0, 0);
	};

	const drawPatternsWithContext = () => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		dispatch(drawPatternImageWithContext(ctx));
	};

	const blobUrl = useSelector(view.selectors.getBlobUrl, shallowEqual);
	const canvasRef = useRef(null);
	const canvasDimensions = useSelector(assemble.selectors.getImageDimensions, shallowEqual);

	return (
		<div className="main">
			<Card className="card" bg="success" style={{width: '28rem'}}>
				<ImageContainer url={blobUrl} id={'orig'} imageLoaded={imageLoaded}/>
				<Card.Header>Vergic Persona</Card.Header>
				<Card.Body>
					<Card.Title>Visibility Settings</Card.Title>
					<Card.Text>
						Drag slider to modify visibility
					</Card.Text>
					<ThresholdSlider/>
					<Card.Title>Color Settings</Card.Title>
					<div className="color-section">
						<ColorView colorId={'backgroundColor'} togglePicker={togglePicker}/>
						<ColorView colorId={'filled'} togglePicker={togglePicker}/>
						<ColorView colorId={'notFilled'} togglePicker={togglePicker}/>
					</div>
					{pickerOpen !== ''
						? (<PhotoshopPicker
							color={color}
							onAccept={() => togglePicker()}
							onCancel={() => togglePicker()}
							onChangeComplete={(c) => setColor(pickerOpen, c.rgb)}
						/>)
						: null}
					{/*<Button variant="primary" onClick={() => drawPatterns()}>Generate</Button>*/}
				</Card.Body>
				<Card.Footer>
					<Button variant="warning" onClick={() => startOver()}>start over</Button>
				</Card.Footer>
			</Card>
			<div className="generated-image-container">
				<canvas
					className="preview-image"
					ref={canvasRef}
					width={600}
					height={600}
				/>
			</div>
		</div>
	);
};

export default Main;

