import React from "react";
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import '../App.css';
import {useDispatch, useSelector, shallowEqual} from 'react-redux'
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';

import {view} from '../ducks/view'
import {assemble} from '../ducks/assemble'

const Handle = Slider.Handle;

const handle = (props) => {
	const {value, dragging, index, ...restProps} = props;
	return (
		<Tooltip
			prefixCls="rc-slider-tooltip"
			overlay={value}
			visible={dragging}
			placement="top"
			key={index}
		>
			<Handle value={value} {...restProps} />
		</Tooltip>
	);
};


function ThresholdSlider() {
	const dispatch = useDispatch();
	const setThreshold = (v) => dispatch(assemble.actions.setThreshold(v));
	const wrapperStyle = {width: 400, margin: 50};
	return (
		<div style={wrapperStyle}>
			<p>Slider with custom handle</p>
			<Slider min={0} max={255} defaultValue={127} handle={handle}
			        onAfterChange={(value) => setThreshold(value)}/>
		</div>
	);
}

export default ThresholdSlider;

