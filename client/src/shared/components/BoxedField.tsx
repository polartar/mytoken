import React, { FunctionComponent } from 'react';

import './BoxedField.scss';

type Props = {
  label?: string,
};

export const BoxedField: FunctionComponent<Props> = ({ label, children }) => {
  return (
    <div className='checkout-field-container'>
      { label && <div className='label'>{ label }</div> }
      <div className='value'>{ children }</div>
    </div>
  );
};
