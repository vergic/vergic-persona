import React from "react";

function ImageContainer({url}) {
	return (
		<div className="image-container">
			<img alt="preview" className="preview-image" src={url}/>
		</div>
	)
}

export default ImageContainer;

