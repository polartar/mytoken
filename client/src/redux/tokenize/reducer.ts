import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import {
  SET_TOKEN_DETAILS,
  RESET_TOKEN_DETAILS,
  SET_TOKEN_INVALID,
  SET_CHECKOUT_DETAILS,
  SET_PROMOCODE_VALIDATION,
} from './actions';
import { Action } from '../../shared/types/action';
import { TransactionResponse, PromoCodeResponse } from '../../services/tokenizer';

const persistConfig = {
  key: 'tokenize',
  storage,
};

export type PromoCodeValidation = Partial<PromoCodeResponse> & {
  code?: string,
};

export type CheckoutDetails = Partial<TransactionResponse> & {
  coin: string,
  promoCode?: string,
};

export type TokenDetails = {
  firstName: string,
  lastName: string,
  ownerCompany: string,
  email: string,
  companyPhone: string,
  website: string,
  symbol: string,
  title: string,
  supply: string,
  assetInfo: string,
  assetType: string,
  otherOptionSelect: boolean,
  otherAsset: string,
  assetId: string,
  divisible: string,
  hodlersLimit: string,
  limitNumber: string,
  ownerETHAddress: string,
  tokenDisplay: string,
  whitelist: boolean,
  allAccredited: boolean,
  invalid: boolean,
  checkoutDetails?: CheckoutDetails,
  comments: string,
  promoCodeValidation?: PromoCodeValidation,
};

const tokenizeStoreInit: TokenDetails = {
  firstName: '',
  lastName: '',
  ownerCompany: '',
  email: '',
  companyPhone: '',
  website: '',
  symbol: '',
  title: '',
  supply: '',
  assetInfo: '',
  assetType: 'Real Estate',
  otherOptionSelect: false,
  otherAsset: '',
  assetId: '',
  divisible: 'Yes',
  hodlersLimit: 'No',
  limitNumber: '',
  ownerETHAddress: '',
  tokenDisplay: 'anyone',
  whitelist: false,
  allAccredited: false,
  invalid: true,
  comments: '',
};

const tokenizeReducer = ( state: TokenDetails = tokenizeStoreInit, action: Action ): TokenDetails => {
  const { type, payload } = action;
  switch ( type ) {
    case RESET_TOKEN_DETAILS:
      return tokenizeStoreInit;
    case SET_TOKEN_DETAILS:
      return {
        ...state,
        ...payload,
      };
    case SET_TOKEN_INVALID:
      return state.invalid === payload ? state : {
        ...state,
        invalid: payload,
      };
    case SET_CHECKOUT_DETAILS:
      return {
        ...state,
        checkoutDetails: payload,
      };
    case SET_PROMOCODE_VALIDATION:
      return {
        ...state,
        promoCodeValidation: payload,
      };
    default:
      return state;
  }
};

export default persistReducer(persistConfig, tokenizeReducer);
