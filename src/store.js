import {configureStore, getDefaultMiddleware, createReducer, createAction} from 'redux-starter-kit'
import {combineReducers} from "redux";
import thunkMiddleware from 'redux-thunk'
import {createLogger} from 'redux-logger'
import createDebounce from 'redux-debounced';
import {assemble} from './ducks/assemble'
import {view} from './ducks/view'
// import createAnalyticsMiddleware from './lib/createAnalyticsMiddleware'
import GoogleTagManager from '@redux-beacon/google-tag-manager';
import { createMiddleware } from 'redux-beacon';
// import actionMap from './lib/actionMap'
import eventMap from './lib/eventMap'

const initialState = {};


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

const gtm = GoogleTagManager();
const gtmMiddleware = createMiddleware(eventMap, gtm);


// const middleware = [thunkMiddleware, logger, createDebounce, ...getDefaultMiddleware()];
const middleware = [createDebounce(), thunkMiddleware, logger, gtmMiddleware, ...getDefaultMiddleware()];
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
