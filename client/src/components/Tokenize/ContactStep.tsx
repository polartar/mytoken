import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Form } from 'react-bootstrap';
import { RootStore } from '../../redux/rootReducer';
import { TokenDetails, TokenizeActions, tokenizeActions } from '../../redux/tokenize';
import { useHandleChange } from '../../shared/hooks/useHandleChange';
import useFormValidation from '../../shared/hooks/useFormValidation';
import Input from '../../shared/components/Input';
import { contactValidationRules } from './constants';

type Props = TokenizeActions & {
  tokenDetails: TokenDetails,
};

const ContactStep = ( props: Props ) => {
  const {
    tokenDetails,
    setTokenDetails,
    setTokenFormInvalid,
  } = props;
  const { t } = useTranslation(['tokenize', 'common']);
  const errors = useFormValidation( contactValidationRules, tokenDetails, setTokenFormInvalid );

  const handleChange = useHandleChange( tokenDetails, setTokenDetails );

  return (
    <Form>
      <div className='step-description'>
        { t('contactStep.stepDescription') }
      </div>
      <Input
        id='email'
        label={ `${ t( 'contactStep.email.label' ) }*` }
        placeholder={ t( 'contactStep.email.placeholder' ) }
        value={ tokenDetails.email }
        onChange={ handleChange }
        textMuted={ errors.email?.msg( t( 'contactStep.email.label' ) ) }
      />
      <Input
        id='companyPhone'
        label={ `${ t( 'contactStep.companyPhone.label' ) }*` }
        placeholder={ t( 'contactStep.companyPhone.placeholder' ) }
        value={ tokenDetails.companyPhone }
        onChange={ handleChange }
        textMuted={ errors.companyPhone?.msg( t( 'contactStep.companyPhone.label' ) ) }
        mask={ /^[0-9()+#-]*$/ }
      />
      <Input
        id='website'
        label={ `${ t( 'contactStep.website.label' ) }*` }
        placeholder={ t( 'contactStep.website.placeholder' ) }
        value={ tokenDetails.website }
        onChange={ handleChange }
        textMuted={ errors.website?.msg( t( 'contactStep.website.label' ) ) }
      />
    </Form>
  );
};

const mapStateToProps = ( state: RootStore ) => ( {
  tokenDetails: state.tokenDetails,
} );

export default connect( mapStateToProps, { ...tokenizeActions } )( ContactStep );
