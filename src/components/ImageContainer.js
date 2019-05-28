import React from "react";

function ImageContainer({url, id, imageLoaded}) {
	return (
		<div className="image-container">
			<img alt="preview" id={id} className="preview-image" src={url} onLoad={() => imageLoaded()}/>
		</div>
	)
}

export default ImageContainer;

