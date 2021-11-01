import React, { createContext, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import Web3 from 'web3';
import {
  Container,
  Button,
  Row,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Contract } from 'web3-eth-contract';

import './Tokenize.scss';
import useSteps from '../../shared/hooks/useSteps';
import withProps from '../../shared/hoc/withProps';
import { RootStore } from '../../redux/rootReducer';
import { TokenizeActions, tokenizeActions, TokenDetails } from '../../redux/tokenize';
import {
  Steps,
  DefaultStep,
  ownerValidationRules,
  assetValidationRules,
  tokenValidationRules,
  contactValidationRules,
  nameValidationRules,
} from './constants';
import { getCoinList } from '../../services/tokenizer';
import { formValidation } from '../../shared/hooks/useFormValidation';

type Props = TokenizeActions & {
  web3: Web3,
  accounts: string[],
  contract: Contract,
  tokenDetails: TokenDetails;
};

const Tokenize = ( props: Props ) => {
  const { resetTokenDetails, tokenDetails } = props;
  const history = useHistory();
  const { pathname } = useLocation();
  const { t } = useTranslation( [ 'tokenize', 'common' ] );
  const { path } = useRouteMatch();
  const { nextStep, prevStep, currentStep } = useSteps( path, Steps, pathname );
  const { title, buttons = [] } = currentStep;
  const hasBackButton = buttons.indexOf( 'back' ) >= 0;
  const hasNextButton = buttons.indexOf( 'next' ) >= 0;
  const hasReviewButton = buttons.indexOf( 'review' ) >= 0;
  const hasCheckoutButton = buttons.indexOf( 'checkout' ) >= 0;
  const hasBakToHomeButton = buttons.indexOf( 'backToHome' ) >= 0;
  const [coinList, setCoinList] = useState<string[]>([]);

  useEffect(() => {
    let errors: any;
    let validStep = currentStep.relPath;

    switch (currentStep.relPath) {
      case '/coinPayment':
        if (!tokenDetails.checkoutDetails?.txn_id) {
          validStep = '/review';
        }
        /* falls through */
      case '/checkout':
        /* falls through */
      case '/review':
        errors = formValidation(ownerValidationRules, tokenDetails);
        if (Object.keys(errors).length > 0) {
          validStep = '/owner';
        }
        /* falls through */
      case '/owner':
        errors = formValidation(assetValidationRules, tokenDetails);
        if (Object.keys(errors).length > 0) {
          validStep = '/asset';
        }
        /* falls through */
      case '/asset':
        errors = formValidation(tokenValidationRules, tokenDetails);
        if (Object.keys(errors).length > 0) {
          validStep = '/token';
        }
        /* falls through */
      case '/token':
        errors = formValidation(contactValidationRules, tokenDetails);
        if (Object.keys(errors).length > 0) {
          validStep = '/contact';
        }
        /* falls through */
      case '/contact':
        errors = formValidation(nameValidationRules, tokenDetails);
        if (Object.keys(errors).length > 0) {
          validStep = '/name';
        }
    }

    if (validStep !== currentStep.relPath) {
      history.replace(`${path}${validStep}`);
    }
    // eslint-disable-next-line
  }, [currentStep]);

  useEffect(() => {
    getCoinList()
    .then(list => list && setCoinList(list))
    .catch(() => console.error(`Can't retrieve coin list`));
  }, [setCoinList]);

  const handleStepChange = ( path: string ) => {
    history.push( path );
  };

  const handleDismiss = () => {
    resetTokenDetails();
    history.push( '/' );
  };

  const stepProps = {
    nextStep,
  };

  return (
    <CoinContext.Provider value={ coinList }>
      <Container className={ classNames({ wider: currentStep.relPath === '/review' }) }>
        <h1>{ t( title ) }</h1>
        <Button className='dismiss' variant='link' onClick={ handleDismiss }>
          <FontAwesomeIcon icon={ faTimes } />
        </Button>
        <Switch>
          { Steps.map( step => (
            <Route key={ step.relPath } path={ `${ path }${ step.relPath }` }>
              { withProps(step.component, stepProps) }
            </Route>
          ) ) }
          <Route>{ withProps(DefaultStep.component, stepProps) }</Route>
        </Switch>
        <Row className='actions'>
          { prevStep && hasBackButton && buttons.indexOf( 'back' ) >= 0 &&
            <Button variant='outline-secondary' onClick={ () => handleStepChange( prevStep() ) }>
              { t( 'common:back' ) }
            </Button>
          }
          { nextStep && hasNextButton &&
            <Button variant='primary' onClick={ () => handleStepChange( nextStep() ) } disabled={ tokenDetails.invalid }>
              { t( 'common:next' ) }
            </Button>
          }
          { nextStep && hasReviewButton &&
            <Button variant='primary' onClick={ () => handleStepChange( nextStep() ) } disabled={ tokenDetails.invalid }>
              { t( 'common:review' ) }
            </Button>
          }
          { nextStep && hasCheckoutButton &&
            <Button variant='primary' onClick={ () => handleStepChange( nextStep() ) }>
              { t( 'common:checkout' ) }
            </Button>
          }
          { hasBakToHomeButton &&
            <Button variant='primary' onClick={ () => { handleDismiss(); } }>
              { t( 'common:backToHome' ) }
            </Button>
          }
        </Row>
      </Container>
    </CoinContext.Provider>
  );
};

const mapStateToProps = ( state: RootStore ) => {
  const { web3: { web3, accounts }, contract, tokenDetails } = state;
  return { web3, accounts, contract, tokenDetails };
};

export const CoinContext = createContext<string[]>([]);
export default connect( mapStateToProps, { ...tokenizeActions } )( Tokenize );
