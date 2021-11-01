import { TokenDetails, CheckoutDetails, PromoCodeValidation } from './reducer';

import { Action, ActionFunction } from '../../shared/types/action';

export const SET_TOKEN_DETAILS = 'SET_TOKEN_DETAILS';
export const RESET_TOKEN_DETAILS = 'RESET_TOKEN_DETAILS';
export const SET_TOKEN_INVALID = 'SET_TOKEN_INVALID';
export const SET_CHECKOUT_DETAILS = 'SET_CHECKOUT_DETAILS';
export const SET_PROMOCODE_VALIDATION = 'SET_PROMOCODE_VALIDATION';

export type TokenizeActions = {
  setTokenDetails: ActionFunction<Partial<TokenDetails>>,
  resetTokenDetails: ActionFunction<void>,
  setTokenFormInvalid: ActionFunction<boolean>,
  setCheckoutDetails: ActionFunction<CheckoutDetails>,
  setPromoCodeValidation: ActionFunction<PromoCodeValidation>,
};

export const setTokenDetails = (tokenDetails: Partial<TokenDetails>): Action<Partial<TokenDetails>> => ({
  type: SET_TOKEN_DETAILS,
  payload: tokenDetails,
});

export const resetTokenDetails = (): Action => ({
  type: RESET_TOKEN_DETAILS,
});

export const setTokenFormInvalid = (invalid: boolean): Action => ({
  type: SET_TOKEN_INVALID,
  payload: invalid,
});

export const setCheckoutDetails = (checkoutDetails: CheckoutDetails): Action => ({
  type: SET_CHECKOUT_DETAILS,
  payload: checkoutDetails,
});

export const setPromoCodeValidation = (promoCodeValidation: PromoCodeValidation): Action => ({
  type: SET_PROMOCODE_VALIDATION,
  payload: promoCodeValidation,
});

export const tokenizeActions: TokenizeActions = {
  setTokenDetails,
  resetTokenDetails,
  setTokenFormInvalid,
  setCheckoutDetails,
  setPromoCodeValidation,
};
