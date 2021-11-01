import { applyMiddleware, createStore, compose } from 'redux';
import { persistStore } from 'redux-persist';
// import Web3 from 'web3';
// import { Contract } from 'web3-eth-contract';
import LogRocket from 'logrocket';

import rootReducer from './rootReducer';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [
  LogRocket.reduxMiddleware(),
];

export default () => { // (web3: Web3, accounts: string[], contract: Contract) => {
  // const store = createStore(rootReducer, {
  //     web3: {
  //       web3,
  //       accounts,
  //     },
  //     contract,
  //   },
  //   composeEnhancers(applyMiddleware(...middlewares)),
  // );
  const store = createStore(rootReducer,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
  const persistor = persistStore(store);

  return { persistor, store };
};