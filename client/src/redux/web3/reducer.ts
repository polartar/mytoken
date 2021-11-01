import Web3 from 'web3';

import { SET_ACCOUNTS } from './actions';
import { Action } from '../../shared/types/action';

export type Web3Store = {
  web3: Web3,
  accounts: string[],
};

const web3StoreInit: Web3Store = { } as Web3Store;

const web3Reducer = ( state: Web3Store = web3StoreInit, action: Action ): Web3Store => {
  const { type, payload } = action;
  switch ( type ) {
    case SET_ACCOUNTS:
      if ( !Array.isArray( payload ) ) {
        return state;
      }
      return {
        ...state,
        accounts: payload,
      };
    default:
      return state;
  }
};

export default web3Reducer;
