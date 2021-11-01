import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Row, Col, Button, Image } from 'react-bootstrap';

import CoinSelect from '../../shared/components/CoinSelect';
import Input, { UpperCase } from '../../shared/components/Input';
import { useHandleChange } from '../../shared/hooks/useHandleChange';
import usePrice from '../../shared/hooks/usePrice';
import { RootStore } from '../../redux/rootReducer';
import { tokenizeActions, TokenizeActions, TokenDetails } from '../../redux/tokenize';
import { createTransaction, checkPromoCode } from '../../services/tokenizer';
import { CoinContext } from './Tokenize';

import './CheckoutStep.scss';

type Props = TokenizeActions & {
  tokenDetails: TokenDetails,
  history: any,
  nextStep: () => string,
};

const CheckoutStep = (props: Props) => {
  const { setPromoCodeValidation, setCheckoutDetails, tokenDetails, history, nextStep } = props;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['tokenize', 'common']);
  const coinList = useContext(CoinContext);
  const [useLTCT, setUseLTCT] = useState(false);
  const [coin, setCoin] = useState(coinList[0]);
  const [checkoutData, setCheckoutData] = useState({ promoCode: ''});
  const handleChange = useHandleChange( checkoutData, setCheckoutData );
  const { promoCodeValidation } = tokenDetails;
  const { price, minPrice } = usePrice();
  const [promoErrorMessage, setPromoErrorMessage] = useState<string | false>(false);
  let total, effectiveDiscount;
  if (price && minPrice) {
    total = Math.max(price - (promoCodeValidation?.value || 0), minPrice);
    effectiveDiscount = promoCodeValidation?.value ? price - total : null;
  }

  const handleApplyDiscount = async () => {
    setLoading(true);
    const result = await checkPromoCode(checkoutData.promoCode);
    if (result) {
      setPromoCodeValidation({
        ...result,
        code: checkoutData.promoCode,
      });
      setPromoErrorMessage(!result.valid && t( 'checkoutStep.promoCode.invalid' ).toString());
      setUseLTCT(!!result.useLTCT);
      setCoin('LTCT');
    } else {
      setPromoErrorMessage(t( 'checkoutStep.promoCode.serverError' ).toString());
    }
    setLoading(false);
  };

  const isWeb3Available = false;

  const handlePayWithCoinPayments = async () => {
    setLoading(true);
    const response = await createTransaction({
      ...tokenDetails,
      checkoutDetails: {
        coin,
        promoCode: promoCodeValidation?.valid ? promoCodeValidation.code : undefined,
      },
    });

    if (response) {
      setCheckoutDetails({ ...response, coin });
      setLoading(false);
      history.push( nextStep() );
    }
  };

  return (
    <div className='checkout'>
      <div className='step-description'>
        { t('checkoutStep.stepDescription') }
      </div>
      { price && (
        <Row className='checkout-details'>
          <Col xs={ 7 }>
            <Row>
              <Col xs={ 8 }>Tokenize Asset</Col>
              <Col xs={ 4 }>$ { price.toFixed(2) }</Col>
            </Row>
            { promoCodeValidation?.valid && (
              <Row>
                <Col xs={ 8 }>Promo Discount</Col>
                <Col xs={ 4 }>-$ { effectiveDiscount?.toFixed(2) }</Col>
              </Row>
            )}
            <hr />
            <Row>
              <Col xs={ 8 }>Total</Col>
              <Col xs={ 4 }>$ { total?.toFixed(2) }</Col>
            </Row>
          </Col>
          <Col xs={ { span: 4, offset: 1 } }>
            <Input
              id='promoCode'
              label={ `${ t( 'checkoutStep.promoCode.label' ) }` }
              placeholder={ t( 'checkoutStep.promoCode.placeholder' ) }
              value={ checkoutData.promoCode }
              onChange={ handleChange }
              textMuted={ promoErrorMessage }
              mask={ /^\w{0,8}$/ }
              prepare={ UpperCase }
            />
            <Button variant='secondary' onClick={ handleApplyDiscount }  disabled={ loading || checkoutData.promoCode?.length === 0 }>
              { t( 'checkoutStep.applyDiscount' ) }
            </Button>
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={ 6 }>
          <CoinSelect
            id='coin-selector'
            name='coin'
            coins={ useLTCT ? ['LTCT'] : coinList }
            onChange={ (event) => setCoin(event.target.value) }
            value={ coin }
          />
          <Button variant='primary' onClick={ handlePayWithCoinPayments }  disabled={ loading }>
            { t( 'checkoutStep.payWithCoinPayments' ) }
          </Button>
        </Col>
        <Col xs={ 6 }>
          <Button
            variant='link'
            disabled={ !isWeb3Available || loading }
            className={ classNames({ disabled: !isWeb3Available || loading })}
          >
            <Image src='/assets/pay-with-metamask.png'/>
          </Button>
          { !isWeb3Available && <span className='notification'>Metamask is not ready or present</span> }
        </Col>
      </Row>
      <Row className='mt-5'>
        <Col>
          <h4>Operating with you smart contract</h4>
          <p>Tokenizer collects 0.1% transaction fees on every transfer paid automatically via the tokens during the time transfer</p>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ( state: RootStore ) => ( {
  tokenDetails: state.tokenDetails,
} );

export default connect( mapStateToProps, { ...tokenizeActions } )( CheckoutStep );
