import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Form } from 'react-bootstrap';
import { RootStore } from '../../redux/rootReducer';
import { TokenDetails, TokenizeActions, tokenizeActions } from '../../redux/tokenize';
import { useHandleChange } from '../../shared/hooks/useHandleChange';
import useFormValidation from '../../shared/hooks/useFormValidation';
import Input, { UpperCase } from '../../shared/components/Input';
import { tokenValidationRules } from './constants';

type Props = TokenizeActions & {
  tokenDetails: TokenDetails,
};

const TokenStep = ( props: Props ) => {
  const {
    tokenDetails,
    setTokenDetails,
    setTokenFormInvalid,
  } = props;
  const { t } = useTranslation(['tokenize', 'common']);
  const errors = useFormValidation( tokenValidationRules, tokenDetails, setTokenFormInvalid );

  const handleChange = useHandleChange( tokenDetails, setTokenDetails );

  return (
    <Form>
      <div className='step-description'>
        { t('tokenStep.stepDescription') }
      </div>
      <Input
        id='symbol'
        label={ `${ t( 'tokenStep.symbol.label' ) }*` }
        placeholder={ t( 'tokenStep.symbol.placeholder' ) }
        value={ tokenDetails.symbol }
        onChange={ handleChange }
        textMuted={ errors.symbol?.msg( t( 'tokenStep.symbol.label' ) ) }
        mask={ /^\w{0,5}$/ }
        prepare={ UpperCase }
      />
      <Input
        id='supply'
        label={ `${ t( 'tokenStep.supply.label' ) }*` }
        placeholder={ t( 'tokenStep.supply.placeholder' ) }
        value={ tokenDetails.supply }
        onChange={ handleChange }
        textMuted={ errors.supply?.msg( t( 'tokenStep.supply.label' ) ) }
        mask={ Number }
      />
      <Input
        id='title'
        label={ `${ t( 'tokenStep.title.label' ) }*` }
        placeholder={ t( 'tokenStep.title.placeholder' ) }
        value={ tokenDetails.title }
        onChange={ handleChange }
        textMuted={ errors.title?.msg( t( 'tokenStep.title.label' ) ) }
      />
      <Input
        id='assetInfo'
        label={ `${ t( 'tokenStep.assetInfo.label' ) }*` }
        placeholder={ t( 'tokenStep.assetInfo.placeholder' ) }
        value={ tokenDetails.assetInfo }
        onChange={ handleChange }
        textMuted={ errors.assetInfo?.msg( t( 'tokenStep.assetInfo.label' ) ) }
      />
    </Form>
  );
};

const mapStateToProps = ( state: RootStore ) => ( {
  tokenDetails: state.tokenDetails,
} );

export default connect( mapStateToProps, { ...tokenizeActions } )( TokenStep );
