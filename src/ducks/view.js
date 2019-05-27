import {createSlice, createSelector} from "redux-starter-kit";


// use as thunk for later if needed
const revokeBlobUrl = (url) => {
	window.URL.revokeObjectURL(url);
};


export const initialState = {
	view: 'start',
	blobUrl: '',
	imageWidth: 0,
	imageHeight: 0,
};

const setBlobUrl = (state, action) => {
	state.blobUrl = action.payload;
};

const setView = (state, action) => {
	state.view = action.payload;
};

const setImageDimensions = (state, action) => {
	state.imageWidth = action.payload.width;
	state.imageHeight = action.payload.height;
};

export const view = createSlice({
	slice: 'view',
	initialState,
	reducers: {
		setView,
		setBlobUrl,
		setImageDimensions
	}
});
view.selectors = {
	getView: createSelector(
		['view.view'],
		(view) => {
			return view;
		}
	),
	getBlobUrl: createSelector(
		['view.blobUrl'],
		(blobUrl) => {
			return blobUrl;
		}
	),
};



