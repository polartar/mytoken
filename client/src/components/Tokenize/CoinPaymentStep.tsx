import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { RootStore } from '../../redux/rootReducer';
import { BoxedField } from '../../shared/components/BoxedField';
import { TokenDetails } from '../../redux/tokenize';

import './CoinPaymentStep.scss';

type Props = {
  tokenDetails: TokenDetails,
};

const CoinPaymentStep = ({ tokenDetails }: Props) => {
  const { checkoutDetails } = tokenDetails;
  const { t } = useTranslation(['tokenize', 'common']);
  
  return (
    <div className='coin-payment'>
      <div className='step-description'>
        { t('coinPaymentStep.stepDescription') }
      </div>
      <Row>
        <Col xs={ 6 }>
          <Image src={ checkoutDetails?.qrcode_url } />
          <BoxedField label={ `${t('coinPaymentStep.priceLabel')} (${checkoutDetails?.coin})` }>
            { checkoutDetails?.amount }
          </BoxedField>
        </Col>
        <Col xs={ 6 }>
          <BoxedField label={ `${t('coinPaymentStep.tokensLabel')} (${tokenDetails.title})` }>
            { tokenDetails.supply }
          </BoxedField>
        </Col>
      </Row>
      <Row>
        <Col>
          <BoxedField label={ `${t('coinPaymentStep.addressLabel')} (${checkoutDetails?.coin})` }>
            { checkoutDetails?.address }
          </BoxedField>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = ( state: RootStore ) => ( {
  tokenDetails: state.tokenDetails,
} );

export default connect(mapStateToProps)(CoinPaymentStep);