import React, {useRef, useState, useEffect} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {useSelector, shallowEqual} from 'react-redux'
import Button from 'react-bootstrap/Button';
import ImageContainer from './ImageContainer'
import ThresholdSlider from './ThresholdSlider'
import {assemble} from '../ducks/assemble'
import {view} from '../ducks/view'
import CanvasDraw from '../lib/CanvasDraw'

const Main = ({patterns, actions, columns}) => {
	// const list = patterns.map((p, i) => <div key={i}>{p.id}</div>);
	// console.log(patterns[0].mask)
	// console.log(patterns[1].mask)
	// console.log('actions', actions)
	// console.log('column', columns)

	const blobUrl = useSelector(view.selectors.getBlobUrl, shallowEqual);
	const canvasRef = useRef(null);
	const [locations, setLocations] = useState([]);
	const [count, incrementCount] = useState(0);
	const canvasDimensions = useSelector(assemble.selectors.getImageDimensions, shallowEqual);
	useEffect(() => {
		console.log('use effect', canvasDimensions);

		const canvas = canvasRef.current;
		const {imageWidth, imageHeight} = canvasDimensions;

		const ctx = canvas.getContext('2d');
		ctx.canvas.width = imageWidth;
		ctx.canvas.height = imageHeight;

		const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);
		CanvasDraw.drawSingleColor(imageWidth, imageHeight, imageData.data);
		ctx.putImageData(imageData, 0, 0);

		return () => console.log('cleanup');
	}, [count]);
	// [columns] to trigger redraw

	return (
		<section>
			<h1>test</h1>
			<ThresholdSlider/>
			<div className="main">
				<ImageContainer url={blobUrl}/>
				<canvas
					className="image-container"
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
		</section>
	);
};

const mapStateToProps = state => {
	return ({
		nbrOfPatterns: state.assemble.patterns.length,
		patterns: state.assemble.patterns,
		columns: state.assemble.columns,
	});
};

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(assemble.actions, dispatch)
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main);

