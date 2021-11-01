import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Col, Form } from 'react-bootstrap';
import { RootStore } from '../../../redux/rootReducer';
import { TokenDetails, TokenizeActions, tokenizeActions } from '../../../redux/tokenize';
import { useHandleChange } from '../../../shared/hooks/useHandleChange';

import { ReviewSection } from './ReviewSection';
import { ReviewRow } from './ReviewRow';

import './Review.scss';

type Props = TokenizeActions & {
  tokenDetails: TokenDetails,
};

const ReviewStep = ( props: Props ) => {
  const {
    tokenDetails,
    setTokenDetails,
  } = props;
  const { t } = useTranslation(['tokenize', 'common']);

  const handleChange = useHandleChange( tokenDetails, setTokenDetails );

  return (
    <div className='review-step'>
      <ReviewSection title={ t( 'reviewStep.personalInformation' ) }>
        <Col lg={ 6 }>
          <ReviewRow label={ t( 'nameStep.firstName.label' ) } value={ tokenDetails.firstName } />
          <ReviewRow label={ t( 'nameStep.lastName.label' ) } value={ tokenDetails.lastName } />
          <ReviewRow label={ t( 'nameStep.ownerCompany.label' ) } value={ tokenDetails.ownerCompany } />
        </Col>
        <Col lg={ 6 }>
          <ReviewRow label={ t( 'contactStep.email.label' ) } value={ tokenDetails.email } />
          <ReviewRow label={ t( 'contactStep.companyPhone.label' ) } value={ tokenDetails.companyPhone } />
          <ReviewRow label={ t( 'contactStep.website.label' ) } value={ tokenDetails.website } />
        </Col>
      </ReviewSection>
      <ReviewSection title={ t( 'reviewStep.tokenDetails' ) }>
        <Col lg={ 6 }>
          <ReviewRow label={ t( 'tokenStep.symbol.label' ) } value={ tokenDetails.symbol } />
          <ReviewRow label={ t( 'tokenStep.title.label' ) } value={ tokenDetails.title } />
          <ReviewRow label={ t( 'tokenStep.supply.label' ) } value={ tokenDetails.supply } />
        </Col>
        <Col lg={ 6 }>
          <ReviewRow label={ t( 'tokenStep.assetInfo.label' ) } value={ tokenDetails.assetInfo } />
        </Col>
      </ReviewSection>
      <ReviewSection title={ t( 'reviewStep.assetOwner' ) }>
        <Col lg={ 6 }>
          <ReviewRow label={ t( 'assetStep.assetType.label' ) }
            value={ tokenDetails.assetType !== 'Other' ? tokenDetails.assetType : tokenDetails.otherAsset } />
          <ReviewRow label={ t( 'assetStep.assetId.label' ) } value={ tokenDetails.assetId } />
          <ReviewRow label={ t( 'assetStep.divisible.label' ) } value={ tokenDetails.divisible } />
        </Col>
        <Col lg={ 6 }>
          <ReviewRow
            label={ t( 'assetStep.hodlersLimit.label' ) }
            value={ tokenDetails.hodlersLimit === 'Yes' ? tokenDetails.limitNumber : t('common:yesNoOptions.No') }
          />
          <ReviewRow label={ t( 'ownerStep.ownerETHAddress.label' ) } value={ tokenDetails.ownerETHAddress } />
          <ReviewRow label={ t( 'reviewStep.tokenDisplayLabel' ) } value={ tokenDetails.tokenDisplay } />
        </Col>
      </ReviewSection>
      <ReviewSection title={ t( 'reviewStep.comments' ) } className='comments'>
        <Form.Group>
          <Form.Control
            as='textarea'
            rows={ 3 }
            name='comments'
            value={ tokenDetails.comments }
            onChange={ handleChange }
          />
        </Form.Group>
      </ReviewSection>
    </div>
  );
};

const mapStateToProps = ( state: RootStore ) => ( {
  tokenDetails: state.tokenDetails,
} );

export default connect( mapStateToProps, { ...tokenizeActions } )( ReviewStep );
