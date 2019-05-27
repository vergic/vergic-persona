import React, {useEffect, useRef} from "react";
import {useDispatch} from 'react-redux'
import {assemble} from '../ducks/assemble'

function ImageContainer({url}) {
	const imageRef = useRef(null);
	const dispatch = useDispatch();
	const setImageDimensions = (width, height) => dispatch(assemble.actions.setImageDimensions({width, height}));

	useEffect(() => {
		return () => setImageDimensions(imageRef.current.naturalWidth, imageRef.current.naturalHeight);
	}, [url]);

	return (
		<div className="image-container">
			<img alt="preview" ref={imageRef} className="preview-image" src={url}/>
		</div>
	)
}

export default ImageContainer;

