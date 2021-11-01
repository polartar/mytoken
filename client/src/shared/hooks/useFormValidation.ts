import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import web3 from 'web3';

export type CustomValidation = ( data: any, field: string ) => string | null;

const FieldPlaceholder = '$fieldName';
const EmailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const NumericRegex = /^\d+$/;
const UrlRegex = /^(http[s]?:\/\/)?[^\s(["<,>]*\.[^\s[",><.]+$/;

type RuleType =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'email'
  | 'numeric'
  | 'ethAddress'
  | 'custom'
  | 'url';

type Rules = {
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  email?: boolean,
  numeric?: boolean,
  ethAddress?: boolean,
  url?: boolean,
  custom?: CustomValidation,
  conditional?: ( data: any ) => boolean,
};

type Errors = {
  [ field: string ]: {
    type: RuleType | undefined,
    msg: ( fieldName?: string ) => string,
  },
};

export type ValidationRules = { [ field: string ]: Rules; };

export const formValidation = ( rulesMap: ValidationRules, data: any, t = ( field: string ) => field ) => {
  let errors: Errors = { };

  Object.entries( rulesMap ).forEach( ( [ field, rules ] ) => {
    const value = data[ field ];
    // if conditional and condition is false, return and don't apply rule
    if ( rules.conditional && !rules.conditional( data ) ) {
      return;
    }
    if ( rules.required !== undefined ) {
      if ( value === undefined || value === null || value === '' ) {
        errors[ field ] = {
          type: 'required',
          msg: fieldName => t( 'required' )
            .replace( FieldPlaceholder, fieldName || '' ),
        };
        return;
      }
    }
    if ( rules.minLength !== undefined ) {
      if ( value && value.toString().length < rules.minLength ) {
        errors[ field ] = {
          type: 'minLength',
          msg: fieldName => t( 'minLength' )
            .replace( FieldPlaceholder, fieldName || '' )
            .replace( '$length', String( rules.minLength ) ),
        };
        return;
      }
    }
    if ( rules.maxLength !== undefined ) {
      if ( value && value.toString().length > rules.maxLength ) {
        errors[ field ] = {
          type: 'maxLength',
          msg: fieldName => t( 'maxLength' )
            .replace( FieldPlaceholder, fieldName || '' )
            .replace( '$length', String( rules.maxLength ) ),
        };
        return;
      }
    }
    if ( rules.email !== undefined ) {
      if ( value && !value.toString().match( EmailRegex ) ) {
        errors[ field ] = {
          type: 'email',
          msg: fieldName => t( 'email' )
            .replace( FieldPlaceholder, fieldName || '' ),
        };
        return;
      }
    }
    if ( rules.numeric !== undefined ) {
      if ( value && !value.toString().match( NumericRegex ) ) {
        errors[ field ] = {
          type: 'numeric',
          msg: fieldName => t( 'numeric' )
            .replace( FieldPlaceholder, fieldName || '' ),
        };
        return;
      }
    }
    if ( rules.ethAddress !== undefined ) {
      if (value) {
        try {
          web3.utils.toChecksumAddress(value);
        } catch (e) { 
          errors[ field ] = {
            type: 'ethAddress',
            msg: fieldName => t( 'ethAddress' )
              .replace( FieldPlaceholder, fieldName || '' ),
          };
          return;
        }
      }
    }
    if ( rules.url !== undefined ) {
      if ( value && !value.toString().match( UrlRegex ) ) {
        errors[ field ] = {
          type: 'url',
          msg: fieldName => t( 'url' )
            .replace( FieldPlaceholder, fieldName || '' ),
        };
        return;
      }
    }
    if ( rules.custom !== undefined ) {
      const errorMsg = rules.custom( data, field );
      if ( errorMsg ) {
        errors[ field ] = {
          type: 'custom',
          msg: fieldName => errorMsg
            .replace( FieldPlaceholder, fieldName || '' ),
        };
        return;
      }
    }
  } );

  return errors;
};

const useFormValidation = ( rulesMap: ValidationRules, data: any, setInvalid?: ( invalid: boolean ) => any ): Errors => {
  const { t } = useTranslation( [ 'formValidation' ] );
  const [ errors, setErrors ] = useState<Errors>( { } );

  useEffect( () => {
    const _errors = formValidation( rulesMap, data, t );

    setInvalid && setInvalid( Object.keys( _errors ).length > 0 );
    setErrors( _errors );
  }, [ rulesMap, data, t, setInvalid ] );

  return errors;
};

export default useFormValidation;