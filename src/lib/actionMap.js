export default {
	'setThreshold': (action, store) => {
		const actionType = action.type.split('/').pop();
		return {
			event: actionType,
			thresholdValue: action.payload
		};
	}
};
