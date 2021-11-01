import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Form,
  Col,
  Row,
  Alert,
} from 'react-bootstrap';
import { RootStore } from '../../redux/rootReducer';
import { TokenDetails, TokenizeActions, tokenizeActions } from '../../redux/tokenize';
import { useHandleChange } from '../../shared/hooks/useHandleChange';
import useFormValidation from '../../shared/hooks/useFormValidation';
import Input, { LowerCase } from '../../shared/components/Input';
import { ownerValidationRules } from './constants';

type Props = TokenizeActions & {
  tokenDetails: TokenDetails,
};

const OwnerStep = ( props: Props ) => {
  const {
    tokenDetails,
    setTokenDetails,
    setTokenFormInvalid,
  } = props;
  const { t } = useTranslation(['tokenize', 'common']);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (tokenDetails.whitelist || tokenDetails.allAccredited) {
      setDirty(true);
    }
  }, [tokenDetails, setDirty]);

  const errors = useFormValidation( ownerValidationRules, tokenDetails, setTokenFormInvalid );

  const handleChange = useHandleChange( tokenDetails, setTokenDetails );

  return (
    <Form>
      <div className='step-description'>
        { t('ownerStep.stepDescription') }
      </div>
      <Alert variant='danger' className='uppercase'>
        <Alert.Heading>{ t('common:important') }</Alert.Heading>
        <p>{ t('ownerStep.stepAlert') }</p>
      </Alert>
      <Input
        id='ownerETHAddress'
        label={ t( 'ownerStep.ownerETHAddress.label' ) }
        placeholder={ t( 'ownerStep.ownerETHAddress.placeholder' ) }
        value={ tokenDetails.ownerETHAddress }
        onChange={ handleChange }
        textMuted={ errors.ownerETHAddress?.msg( t( 'ownerStep.ownerETHAddress.label' ) ) }
        mask='{\0\x}XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        prepare={ LowerCase }
      />
      <Row>
        <Col>
          <Form.Check
            id='tokenDisplay.anyone'
            label={ `${ t('ownerStep.tokenDisplay.anyone') }*` }
            name='tokenDisplay'
            checked={ tokenDetails.tokenDisplay === 'anyone'}
            value='anyone'
            type='radio'
            onChange={ handleChange }
          />
        </Col>
        <Col>
          <Form.Check
            id='tokenDisplay.restricted'
            label={ `${ t('ownerStep.tokenDisplay.restricted') }*` }
            name='tokenDisplay'
            checked={ tokenDetails.tokenDisplay === 'restricted'}
            value='restricted'
            type='radio'
            onChange={ handleChange }
          />
          <div className='restricted'>
            <Form.Check
              id='tokenDisplay.whitelist'
              label={ `${ t('ownerStep.tokenDisplay.whitelist') }*` }
              name='whitelist'
              checked={ tokenDetails.whitelist }
              type='checkbox'
              onChange={ handleChange }
              disabled={ tokenDetails.tokenDisplay !== 'restricted' }
            />
            <Form.Check
              id='tokenDisplay.allAccredited'
              label={ `${ t('ownerStep.tokenDisplay.allAccredited') }*` }
              name='allAccredited'
              checked={ tokenDetails.allAccredited }
              type='checkbox'
              onChange={ handleChange }
              disabled={ tokenDetails.tokenDisplay !== 'restricted' }
            />
          </div>
          { dirty && errors.tokenDisplay && <small className='text-muted error form-text'>{ t(errors.tokenDisplay.msg()) }</small> }
        </Col>
      </Row>
    </Form>
  );
};

const mapStateToProps = ( state: RootStore ) => ( {
  tokenDetails: state.tokenDetails,
} );

export default connect( mapStateToProps, { ...tokenizeActions } )( OwnerStep );
