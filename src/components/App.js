import React from "react";
import '../App.css';
import Button from 'react-bootstrap/Button';
import Main from './Main'
import FileDropZone from './FileDropZone'
import {useDispatch, useSelector, shallowEqual} from 'react-redux'

import {view} from '../ducks/view'

function App() {
	const dispatch = useDispatch();
	const currentView = useSelector(view.selectors.getView, shallowEqual);
	const setView = (v) => dispatch(view.actions.setView(v));

	let element = null;
	switch (currentView) {
		case 'start':
			element = <div>hello</div>;
			break;
		case 'dropzone':
			element = <FileDropZone/>;
			break;
		case 'main':
			element = <Main/>;
			break;
		default:
			element = <div>default</div>;
	}
	return (
		<div className="App">
			{element}
			{/*<Button variant="primary" onClick={() => setView('start')}>Start</Button>*/}
			{/*<Button variant="primary" onClick={() => setView('dropzone')}>Dropzone</Button>*/}
			{/*<Button variant="primary" onClick={() => setView('main')}>Main</Button>*/}
		</div>
	);
}

export default App;

