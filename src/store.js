import {configureStore, getDefaultMiddleware, createReducer, createAction} from 'redux-starter-kit'
import {combineReducers} from "redux";
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import createDebounce from 'redux-debounced';
import {assemble} from './ducks/assemble'
import {view} from './ducks/view'

const initialState = {};
// patterns: [],
// columns: [],
// };


const logger2 = ({getState}) => {
	return (next) => (action) => {

		console.log('logger', action);
		const returnValue = next(action);
		const nextState = getState();

		return returnValue
	}
}


const logger = createLogger({
	timestamp: true,
	duration: true,
	collapsed: true,
	predicate: true,
});

const reducer = combineReducers({
	assemble: assemble.reducer,
	view: view.reducer
});

// const middleware = [thunkMiddleware, logger, createDebounce, ...getDefaultMiddleware()];
const middleware = [logger, ...getDefaultMiddleware()];
const configureAppStore = (preloadedState) => {
	const store = configureStore({
		reducer,
		middleware,
		preloadedState,
	});

	// if (process.env.NODE_ENV !== 'production' && module.hot) {
	// 	module.hot.accept('./reducers', () => store.replaceReducer(reducer))
	// }

	return store
};

const store = configureAppStore(initialState);

export default store;
