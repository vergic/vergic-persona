import React, {useRef, useState, useEffect} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import Button from 'react-bootstrap/Button';
import ImageContainer from './ImageContainer'
import ThresholdSlider from './ThresholdSlider'
import {assemble, initWithImageData, drawBlocksImage, drawPatternImage} from '../ducks/assemble'
import {view} from '../ducks/view'

const Main = ({patterns, actions, columns}) => {

	const dispatch = useDispatch();
	const init = (imageData) => dispatch(initWithImageData(imageData));

	const imageLoaded = () => {
		drawOriginal();
		const {imageWidth, imageHeight} = canvasDimensions;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
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

	const blobUrl = useSelector(view.selectors.getBlobUrl, shallowEqual);
	const canvasRef = useRef(null);
	const [locations, setLocations] = useState([]);
	const [count, incrementCount] = useState(0);
	const canvasDimensions = useSelector(assemble.selectors.getImageDimensions, shallowEqual);
	useEffect(() => {
		const {imageWidth, imageHeight} = canvasDimensions;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		ctx.canvas.width = imageWidth;
		ctx.canvas.height = imageHeight;

		// ctx.putImageData(imageData, 0, 0);

		return () => console.log('cleanup');
	}, [count]);
	// [columns] to trigger redraw

	return (
		<div className="main">
			<h1>pattern image maker</h1>
			<ThresholdSlider/>
			<Button variant="primary" onClick={() => drawOriginal()}>Draw original</Button>
			<Button variant="primary" onClick={() => drawBlocks()}>Draw blocks</Button>
			<Button variant="primary" onClick={() => drawPatterns()}>Draw pattern</Button>
			<div className="images">
				<ImageContainer url={blobUrl} id={'orig'} imageLoaded={imageLoaded}/>
				<div className="image-container">
					<canvas
						className="preview-image"
						ref={canvasRef}
						width={200}
						height={200}
						onClick={e => {
							const canvas = canvasRef.current;
							const ctx = canvas.getContext('2d');
							const newLocation = {x: e.clientX, y: e.clientY}
							setLocations([...locations, newLocation]);
							if (locations.length > 3) {
								incrementCount(count + 1);
							}
							console.log(locations);
							// implement draw on ctx here
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Main;

