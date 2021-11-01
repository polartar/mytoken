import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.scss';

import configureStore from './redux/store';

// import { useWeb3, useWeb3Accounts } from './shared/hooks/useWeb3';
// import { useContract } from './shared/hooks/useContract';

// import Header from './shared/components/Header';
// import Footer from './shared/components/Footer';
import LoadingApp from './shared/Loading/LoadingApp';
import LoadingSection from './shared/Loading/LoadingSection';

// const useWeb3StorageValue = ( account?: string, contract?: Contract ) => {
//   const [ storageValue, setStorageValue ] = useState<string>();

//   useEffect( () => {
//     if ( account && contract ) {
//       // Get the value from the contract to prove it worked.
//       contract.methods.tokenId().call( { from: account } )
//         .then( ( response: any ) => {
//           console.log( response );
//           console.log( typeof response._method.name );
//           setStorageValue( response._method.name );
//         } )
//         .catch( () => { } );
//     }
//   }, [ account, contract ] );

//   return storageValue;
// };

const App = () => {
  // const web3 = useWeb3();
  // const accounts = useWeb3Accounts( web3 );
  // const contract = useContract( web3 );

  // const storageValue = useWeb3StorageValue(accounts && accounts[0], contract);

  // console.log(storageValue);

  // let status;
  // if ( !web3 ) {
  //   status = 'Loading web3';
  // } else if ( !accounts ) {
  //   status = 'Loading Accounts';
  // } else {
  //   status = 'Loading Contracts';
  // }

  // if ( !web3 || !accounts || !contract ) {
  //   return <LoadingApp status={ status } />;
  // }

  // const { persistor, store } = configureStore(web3, accounts, contract);
  const { persistor, store } = configureStore();

  return (
    <div className='App' style={ { background: '#f8faff' } } >
      <Provider store={ store }>
        <PersistGate
          loading={ <LoadingApp status='Loading App state' /> }
          persistor={ persistor }
        >
          <Router>
            <Suspense fallback={ <LoadingSection /> }>
              <Switch>
                { /* <Route path='/admin' component={ lazy(() => import('./components/Admin')) } /> */ }
                <Route path='/tokenize' component={ lazy(() => import('./components/Tokenize')) } />
                <Route path='/confirm' component={ lazy(() => import('./components/TokenConfirmation')) } />
                <Route path='/' component={ lazy(() => import('./components/Home')) } />
              </Switch>
            </Suspense>
          </Router>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
