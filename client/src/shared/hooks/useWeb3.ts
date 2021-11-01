import { useState, useEffect } from 'react';
import Web3 from 'web3';

import { onError } from '../utils/errorCatcher';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

const getWeb3 = (): Promise<Web3> =>
  new Promise( ( resolve, reject ) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener( 'load', async () => {
      // Modern dapp browsers...
      if ( window.ethereum ) {
        const web3 = new Web3( window.ethereum );
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Acccounts now exposed
          resolve( web3 );
        } catch ( error ) {
          reject( error );
        }
      }
      // Legacy dapp browsers...
      else if ( window.web3 ) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log( 'Injected web3 detected.' );
        resolve( web3 );
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          'http://127.0.0.1:8545',
        );
        const web3 = new Web3( provider );
        console.log( 'No web3 instance injected, using Local web3.' );
        resolve( web3 );
      }
    } );
  } );

export const useWeb3 = () => {
  const [ web3, setWeb3 ] = useState<Web3>();

  useEffect( () => {
    getWeb3()
      .then( setWeb3 )
      .catch( onError );
  }, [] );

  return web3;
};

export const useWeb3Accounts = ( web3?: Web3 ) => {
  const [ accounts, setAccounts ] = useState<string[]>();

  useEffect( () => {
    if ( web3 ) {
      web3.eth.getAccounts()
        .then( accounts => setAccounts( accounts ) )
        .catch( onError );
    }
  }, [ web3 ] );

  return accounts;
};
