import React, {useCallback, useState} from 'react'
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import {useDropzone} from 'react-dropzone'
import ImageLoadedContainer from './ImageLoadedContainer'
import {view} from '../ducks/view'

const generateBlobUrl = (data, type = 'octet/stream') => {
	const blob = new Blob([data], {type});
	return window.URL.createObjectURL(blob);
};

function FileDropZone() {

	const dispatch = useDispatch();
	const blobUrl = useSelector(view.selectors.getBlobUrl, shallowEqual);
	const setBlobUrl = (url) => dispatch(view.actions.setBlobUrl(url));

	const [progress, setProgress] = useState('waiting');

	const readFile = (file) => {
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.onloadend = (e) => {
			const blobUrl = generateBlobUrl(reader.result);
			setProgress('done');
			setBlobUrl(blobUrl);
		};
		setProgress('loading');
		reader.readAsArrayBuffer(file);
	};

	const onDrop = useCallback(acceptedFiles => {
		readFile(acceptedFiles[0]);
	});

	const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

	return (
		<div className="dropzone-container" {...getRootProps()}>
			<input {...getInputProps()} />
			{
				isDragActive ?
					<p>Drop the image here ...</p> :
					<p>Drag 'n' drop an image here, or click to select an image</p>
			}
			{progress === 'done'
				? <ImageLoadedContainer url={blobUrl}/>
				: null}
		</div>
	)
}

export default FileDropZone;
