import React from "react";
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import {SketchPicker} from 'react-color'
import {assemble, updateColor} from '../ducks/assemble'


function ColorView({colorId, pickerOpen, setPickerOpen}) {

	const dispatch = useDispatch();
	const setColor = (colorId, color) => dispatch(updateColor(colorId, color));
	const togglePicker = () => {
		const p = pickerOpen === colorId
			? ''
			: colorId;

		setPickerOpen(p);
	};

	const color = useSelector(assemble.selectors.getColors, shallowEqual)[colorId];
	const style = {
		backgroundColor: color
	};

	return (
		<div className="">
			<div className="color-box" style={style} onClick={() => togglePicker()}/>
			{pickerOpen === colorId
				? (<SketchPicker
					color={color}
					onChangeComplete={(c) => setColor(colorId, c.rgb)}
				/>)
				: null}

		</div>
	)
}

export default ColorView;

