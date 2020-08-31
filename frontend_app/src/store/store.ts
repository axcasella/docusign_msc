import { applyMiddleware, createStore, compose, Middleware } from 'redux';
import thunk from 'redux-thunk';
// import createSagaMiddleware from 'redux-saga';
import RootReducer from './rootReducer';

// import rootSaga from './redux/RootSaga';

// const sagaMiddleWare = createSagaMiddleware();

const initialState = {};
// const middleware = [thunk, sagaMiddleWare];
const middleware: Middleware[] = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  RootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);


// sagaMiddleWare.run(rootSaga);

export default store;
