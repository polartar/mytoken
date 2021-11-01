import { useState, useEffect } from 'react';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';

import { onError } from '../utils/errorCatcher';
import SelfTokenizerContract from '../../contracts/SelfTokenizer.json';

export const useContract = ( web3?: Web3 ) => {
  const [ contract, setContract ] = useState<Contract>();

  useEffect( () => {
    if ( web3 ) {
      // Get the contract instance.
      web3.eth.net.getId()
        .then( networkId => {
          const networks: { [ key: number ]: any; } = SelfTokenizerContract.networks;
          const deployedNetwork = networks[ networkId ];
          const instance = new web3.eth.Contract(
            SelfTokenizerContract.abi as AbiItem[],
            deployedNetwork && deployedNetwork.address,
          );
          setContract( instance );
        } )
        .catch( onError );
    }
  }, [ web3 ] );

  return contract;
};