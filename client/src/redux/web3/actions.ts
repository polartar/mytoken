import Web3 from 'web3';

import { Action, ActionFunction } from '../../shared/types/action';

export const SET_ACCOUNTS = 'SET_ACCOUNTS';

export type Web3Actions = {
  setWeb3: ActionFunction<Web3 | undefined>,
  setAccounts: ActionFunction<string[]>,
};

export const setAccounts = (accounts: string[]): Action<string[]> => ({
  type: SET_ACCOUNTS,
  payload: accounts,
});
