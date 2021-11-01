import React, { useState } from 'react';
// @ts-ignore
import { IMaskMixin } from 'react-imask';

import {
  Form,
} from 'react-bootstrap';
import { ChangeEvent } from '../hooks/useHandleChange';

import './Input.scss';

export const UpperCase = (value: string) => value?.toUpperCase();
export const LowerCase = (value: string) => value?.toLowerCase();
export const WordCharacter = /^\w+$/;
export const Digits = /^\d+$/;
export const Letters = /^[a-zA-Z]$/;

type Props = {
  id: string,
  name?: string,
  type?: string,
  className?: string,
  placeholder?: string,
  onChange?: (event: ChangeEvent) => void,
  value?: string,
  label?: string,
  textMuted?: string | false,
  disabled?: boolean,
  mask?: any,
  prepare?: (value: string, masked?: string) => string,
  commit?: (value: string, masked?: string) => string,
  radix?: string,
  unmask?: string | boolean,
  innerRef?: any,
};

const InputBase = (props: Props) => {
  const {
    id,
    name,
    type = 'text',
    className,
    placeholder = props.label,
    onChange,
    value,
    label,
    textMuted,
    disabled = false,
    innerRef,
  } = props;
  const [dirty, setDirty] = useState<boolean>((value || '').length > 0);

  const handleChange = (event: ChangeEvent) => {
    setDirty(true);
    onChange && onChange(event);
  };

  return (
    <Form.Group controlId={ id } className={ className }>
      { label && <Form.Label>{ label }</Form.Label> }
      <Form.Control
        name = { name || id }
        type={ type }
        placeholder={ placeholder }
        value={ value }
        onChange={ handleChange }
        disabled={ disabled }
        ref={ innerRef }
      />
      { dirty && textMuted && <Form.Text className='text-muted error'>{ textMuted }</Form.Text> }
    </Form.Group>
  );
};

const MaskedStyledInput = IMaskMixin(({ inputRef, ...props }: any) => {
  const _props = { ...props };
  delete _props.onChange;
  delete _props.value;
  return (
    <InputBase
      { ..._props }
      innerRef={ inputRef }
    />
  );
});

const Input = (props: Props) => {
  const {
    mask,
    prepare,
    commit,
    onChange,
    name,
    id,
    value,
    unmask = true,
    radix = '.',
  } = props;

  const handleChange = (value: string) => {
    onChange && onChange({
      target: {
        name: name || id,
        value: value,
      },
    });
  };

  return !mask ? <InputBase { ...props }/> : (
    <MaskedStyledInput
      { ...props }
      mask={ mask }
      definitions={ {
        X: /[0-9a-fA-F]/,
      } }
      prepare={ prepare }
      commit={ commit }
      onAccept={ handleChange }
      value={ value }
      unmask={ unmask }
      radix={ radix }
    />
  );
};

export default Input;
