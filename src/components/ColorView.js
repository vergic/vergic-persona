import React from "react";
import {useSelector, shallowEqual} from 'react-redux'
import {assemble} from '../ducks/assemble'


function ColorView({colorId, togglePicker}) {

	const color = useSelector(assemble.selectors.getColors, shallowEqual)[colorId];
	const style = {
		backgroundColor: color
	};
	const txt = {
		filled: 'filled',
		notFilled: 'empty',
		backgroundColor: 'background'
	}[colorId];

	return (
		<div className="">
			<div className="color-box" style={style} onClick={() => togglePicker(colorId)}>
				{txt}
			</div>

		</div>
	)
}

export default ColorView;

