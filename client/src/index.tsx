import React from 'react';
import ReactDOM from 'react-dom';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import ReactGA from 'react-ga';

import { applyPolyfills, defineCustomElements } from '@defi-ventures/tokenizer-common/loader';

import 'bootstrap/dist/css/bootstrap.min.css';

import './i18n';

import '@defi-ventures/tokenizer-common/dist/tokenizer-common/tokenizer-common.css';
import './index.css';
import App from './App';

import * as serviceWorker from './serviceWorker';

LogRocket.init('defi-ventures/self-tokenization-platform');
setupLogRocketReact(LogRocket);
ReactGA.initialize('UA-153439526-1');

const rootElement = document.getElementById( 'root' );
ReactDOM.render(<App />, rootElement );

applyPolyfills().then(() => {
  defineCustomElements();
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
