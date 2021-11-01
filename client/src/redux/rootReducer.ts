import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import web3, { Web3Store } from './web3/reducer';
import contract, { ContractStore } from './contract';
import tokenDetails, { TokenDetails } from './tokenize';

export type RootStore = {
  web3: Web3Store,
  contract: ContractStore,
  tokenDetails: TokenDetails,
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['tokenDetails'],
};

const rootReducer = combineReducers({
  web3,
  contract,
  tokenDetails,
});

export default persistReducer(persistConfig, rootReducer);

