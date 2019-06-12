const createAnalyticsMiddleware = (dataLayer = [], actionMap = {}) => store => next => action => {
	next(action);

	const actionType = action.type.split('/').pop();
	if (!Object.keys(actionMap).includes(actionType)) {
		return;
	}
	const nextState = store.getState();
	const transform = actionMap[actionType];
	const data = transform(action, nextState);
	dataLayer.push(data);
};
export default createAnalyticsMiddleware;
