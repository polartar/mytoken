// import { ContractStore } from './../redux/contract/reducer';
// import { TokenDetails } from './../redux/tokenize/reducer';
// import Web3 from 'web3';
import axios, { AxiosResponse } from 'axios';
import { TokenDetails } from '../redux/tokenize';

export type TransactionResponse = {
  address: string,
  amount: string,
  checkout_url?: string,
  confirms_needed: string,
  qrcode_url: string,
  status_url: string,
  timeout: number,
  txn_id: string,
};

export type PriceResponse = {
  price: number,
  minPrice: number,
};

export type PromoCodeResponse = {
  valid?: boolean,
  value?: number,
  useLTCT?: boolean,
};

const tokenizer = axios.create({
  // baseURL: 'http://localhost:3030',
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

function success<T>(response: AxiosResponse<T>) {
  return response.data;
}

function failure(response: AxiosResponse) {
  // TODO: Show something to the customer
  console.error(response);
  return null;
}

export const createTransaction = (tokenDetails: TokenDetails) => {
  console.log('Sending...');
  return tokenizer.post<TransactionResponse>(`/createTransaction`, tokenDetails)
    .then(success)
    .catch(failure);
};

export const getCoinList = () => {
  return tokenizer.get<string[]>(`/coins`)
    .then(success)
    .catch(failure);
};

export const getPrice = () => {
  return tokenizer.get<PriceResponse>(`/price`)
    .then(success)
    .catch(failure);
};

export const checkPromoCode = (promoCode: string) => {
  console.log('Checking PromoCode: ' + promoCode);
  return tokenizer.get<PromoCodeResponse>(`/promoCode/${promoCode}`)
    .then(success)
    .catch(failure);
};

// export const createContract = (contract: ContractStore, account: Account, web3: Web3, tokenDetails: TokenDetails) => {
//   const { title, symbol, supply, assetType, assetInfo, assetId, hodlersLimit, limitNumber, whitelist, allAccredited } = tokenDetails;
//     contract.methods.tokenizeAsset(
//       title,
//       symbol,
//       supply,
//       assetInfo,
//       assetType,
//       assetId,
//       hodlersLimit,
//       limitNumber,
//       whitelist,
//       allAccredited,
//     ).send( { from: account, value: web3.utils.toBN( 250000000000000000 ), gas: 4700000 } );
// };
