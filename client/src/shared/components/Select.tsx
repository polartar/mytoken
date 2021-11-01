import React, { Component } from 'react';

import {
  Form,
} from 'react-bootstrap';
import { FormControlElement } from '../types/bootstrap';

import './Select.scss';

type Option = {
  content: string | Component | JSX.Element,
  value: string,
};

export type Options = (Option | string)[];

type Props = {
  id: string,
  options: Options,
  multiple?: boolean,
  className?: string,
  placeholder?: string,
  onChange?: (event: React.ChangeEvent<FormControlElement>) => void,
  value?: string,
  label?: string,
  textMuted?: string,
  disabled?: boolean,
};

const Select = (props: Props) => {
  const {
    id,
    options,
    multiple = false,
    className,
    placeholder = props.label,
    onChange = () => { },
    value = '',
    label,
    textMuted,
    disabled = false,
  } = props;
  
  const parsedOptions: Option[] = options.map((option: any) => ({
    content: option.content || option,
    value: option.value || option,
  }));

  return (
    <Form.Group controlId={ id } className={ className }>
      { label && <Form.Label>{ label }</Form.Label> }
      <div className='select-box'>
        <Form.Control
          as='select'
          multiple={ multiple }
          name = { id }
          placeholder={ placeholder }
          value={ value }
          onChange={ onChange }
          disabled={ disabled }
        >
          { parsedOptions.map(option => (
              <option 
                value={ option.value } 
                key={ option.value }>
                { option.content }
              </option>
          ))}
        </Form.Control>
      </div>
      { textMuted && <Form.Text className='text-muted'>{ textMuted }</Form.Text> }
    </Form.Group>
  );
};

export default Select;
