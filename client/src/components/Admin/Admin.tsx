import React, { createContext } from 'react';
import { connect } from 'react-redux';
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
} from 'react-router-dom';
import Web3 from 'web3';
import {
  Container,
} from 'react-bootstrap';
import { Contract } from 'web3-eth-contract';
import { RootStore } from '../../redux/rootReducer';

import TokenDashboard from './TokenDashboard';
import TokenDetail from './TokenDetail';
import TokenEvents from './TokenEvents';
import Web3ConnetionModal from './Web3ConnectionModal';

import './Admin.scss';

type Props = {
  web3: Web3,
  accounts: string[],
  contract: Contract,
};

const Admin = ( props: Props ) => {
  // TODO: Check we3 connection
  const { path } = useRouteMatch();

  const web3Fail = Math.random() > 0.5;

  if (web3Fail) {
    return (
      <Container>
        <Web3ConnetionModal />
      </Container>
    );
  }

  return (
    <Container>
      { /* TODO: Implement navigation here */ }
      <div><a href=''>All Tokens</a> / <a href=''>Some Token</a></div>
      <Switch>
        <Route path={ `${ path }/token/:tokenId/events` }>
          <TokenEvents />
        </Route>
        <Route path={ `${ path }/token/:tokenId` }>
          <TokenDetail />
        </Route>
        <Route path={ `${ path }/token` }>
          <TokenDashboard />
        </Route>
        <Redirect to={ `${ path }/token` }/>
      </Switch>
    </Container>
  );
};

const mapStateToProps = ( state: RootStore ) => {
  const { web3: { web3, accounts }, contract, tokenDetails } = state;
  return { web3, accounts, contract, tokenDetails };
};

export const CoinContext = createContext<string[]>([]);
export default connect( mapStateToProps )( Admin );
