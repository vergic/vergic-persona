import {configureStore, getDefaultMiddleware, createReducer, createAction} from 'redux-starter-kit'
import {combineReducers} from "redux";
import createDebounce from 'redux-debounced';
import assemble from './ducks/assemble'

const initialState = {};
// patterns: [],
// columns: [],
// };

const reducer = combineReducers({
	assemble: assemble.reducer,
});


const middleware = [createDebounce(), ...getDefaultMiddleware()];
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
