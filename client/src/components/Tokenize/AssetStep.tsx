import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Form } from 'react-bootstrap';
import { RootStore } from '../../redux/rootReducer';
import { TokenDetails, TokenizeActions, tokenizeActions } from '../../redux/tokenize';
import { useHandleChange } from '../../shared/hooks/useHandleChange';
import useFormValidation from '../../shared/hooks/useFormValidation';
import useTranslatedOptions from '../../shared/hooks/useTranslatedOptions';
import useYesNoOptions from '../../shared/hooks/useYesNoOptions';
import Input from '../../shared/components/Input';
import Select from '../../shared/components/Select';

import { AssetTypeOptions, assetValidationRules } from './constants';

type Props = TokenizeActions & {
  tokenDetails: TokenDetails,
};

const AssetStep = ( props: Props ) => {
  const {
    tokenDetails,
    setTokenDetails,
    setTokenFormInvalid,
  } = props;
  const { t } = useTranslation(['tokenize', 'common']);
  const yesNoOptions = useYesNoOptions();
  const assetTypeOptions = useTranslatedOptions(AssetTypeOptions, 'assetStep.assetType.options', t);
  const errors = useFormValidation( assetValidationRules, tokenDetails, setTokenFormInvalid );

  const handleChange = useHandleChange( tokenDetails, setTokenDetails );

  return (
    <Form>
      <div className='step-description'>
        { t('assetStep.stepDescription') }
      </div>
      <Select
        id='assetType'
        label={ `${ t( 'assetStep.assetType.label' ) }*` }
        options={ assetTypeOptions }
        value={ tokenDetails.assetType }
        onChange={ handleChange }
      />
      <Input
        id='otherAsset'
        placeholder={ t( 'assetStep.otherAsset.placeholder' ) }
        value={ tokenDetails.otherAsset }
        onChange={ handleChange }
        disabled={ tokenDetails.assetType !== 'Other' }
        textMuted={ errors.otherAsset?.msg( t( 'assetStep.otherAsset.label' ) ) }
      />
      <Input
        id='assetId'
        label={ `${ t( 'assetStep.assetId.label' ) }` }
        placeholder={ t( 'assetStep.assetId.placeholder' ) }
        value={ tokenDetails.assetId }
        onChange={ handleChange }
        textMuted={ errors.assetId?.msg( t( 'assetStep.assetId.label' ) ) }
      />
      <Select
        id='divisible'
        label={ `${ t( 'assetStep.divisible.label' ) }*` }
        options={ yesNoOptions }
        value={ tokenDetails.divisible }
        onChange={ handleChange }
      />
      <Select
        id='hodlersLimit'
        label={ `${ t( 'assetStep.hodlersLimit.label' ) }*` }
        options={ yesNoOptions }
        value={ tokenDetails.hodlersLimit }
        onChange={ handleChange }
      />
      <Input
        id='limitNumber'
        placeholder={ t('assetStep.limitNumber.placeholder') }
        value={ tokenDetails.limitNumber }
        onChange={ handleChange }
        disabled={ tokenDetails.hodlersLimit === 'No' }
        textMuted={ errors.limitNumber?.msg( t( 'assetStep.limitNumber.label' ) ) }
        mask={ Number }
      />
    </Form>
  );
};

const mapStateToProps = ( state: RootStore ) => ( {
  tokenDetails: state.tokenDetails,
} );

export default connect( mapStateToProps, { ...tokenizeActions } )( AssetStep );
