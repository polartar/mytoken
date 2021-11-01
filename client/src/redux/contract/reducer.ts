import { Contract } from 'web3-eth-contract';

import { SET_CONTRACT } from './actions';
import { Action } from '../../shared/types/action';

export type ContractStore = Contract;

const contractReducer = ( state: Contract = { } as ContractStore, action: Action ): ContractStore => {
  const { type, payload } = action;
  switch ( type ) {
    case SET_CONTRACT:
      return payload;
    default:
      return state;
  }
};

export default contractReducer;
