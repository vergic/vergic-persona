const setThreshold = (action) => {
	console.log('analytics event', action);
	const actionType = action.type.split('/').pop();
	return {
		event: actionType,
		category: 'settings',
		thresholdValue: action.payload
	};
};

export default {
	'assemble/setThreshold':setThreshold
};