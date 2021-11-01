import { Contract } from 'web3-eth-contract';

import { Action, ActionFunction } from '../../shared/types/action';

export const SET_CONTRACT = 'SET_CONTRACT';

export type ContractActions = {
  setContract: ActionFunction<Contract | undefined>,
};

export const setContract = (contract?: Contract): Action<Contract | undefined> => ({
  type: SET_CONTRACT,
  payload: contract,
});
