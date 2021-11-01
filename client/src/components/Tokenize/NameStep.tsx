import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Form } from 'react-bootstrap';
import { RootStore } from '../../redux/rootReducer';
import { TokenDetails, TokenizeActions, tokenizeActions } from '../../redux/tokenize';
import { useHandleChange } from '../../shared/hooks/useHandleChange';
import useFormValidation from '../../shared/hooks/useFormValidation';
import Input from '../../shared/components/Input';
import { nameValidationRules } from './constants';

type Props = TokenizeActions & {
  tokenDetails: TokenDetails,
};

const NameStep = ( props: Props ) => {
  const {
    tokenDetails,
    setTokenDetails,
    setTokenFormInvalid,
  } = props;
  const { t } = useTranslation( [ 'tokenize', 'common' ] );
  const errors = useFormValidation( nameValidationRules, tokenDetails, setTokenFormInvalid );

  const handleChange = useHandleChange( tokenDetails, setTokenDetails );

  return (
    <Form>
      <div className='step-description'>
        { t( 'nameStep.stepDescription' ) }
      </div>
      <Input
        id='firstName'
        label={ `${ t( 'nameStep.firstName.label' ) }*` }
        placeholder={ t( 'nameStep.firstName.placeholder' ) }
        value={ tokenDetails.firstName }
        onChange={ handleChange }
        textMuted={ errors.firstName?.msg( t( 'nameStep.firstName.label' ) ) }
      />
      <Input
        id='lastName'
        label={ `${ t( 'nameStep.lastName.label' ) }*` }
        placeholder={ t( 'nameStep.lastName.placeholder' ) }
        value={ tokenDetails.lastName }
        onChange={ handleChange }
        textMuted={ errors.lastName?.msg( t( 'nameStep.lastName.label' ) ) }
      />
      <Input
        id='ownerCompany'
        label={ `${ t( 'nameStep.ownerCompany.label' ) }*` }
        placeholder={ t( 'nameStep.ownerCompany.placeholder' ) }
        value={ tokenDetails.ownerCompany }
        onChange={ handleChange }
        textMuted={ errors.ownerCompany?.msg( t( 'nameStep.ownerCompany.label' ) ) }
      />
    </Form>
  );
};

const mapStateToProps = ( state: RootStore ) => ( {
  tokenDetails: state.tokenDetails,
} );

export default connect( mapStateToProps, { ...tokenizeActions } )( NameStep );
