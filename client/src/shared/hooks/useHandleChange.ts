import { useState } from 'react';
import { FormControlElement } from '../types/bootstrap';

export type ChangeEvent = {
  target: {
    name: string,
    value: string,
    type?: string,
  },
};

export function useHandleChange<T extends { [ key: string ]: any }>(data: T, setData: (data: T) => void) {
  return ( event: React.ChangeEvent<FormControlElement> | ChangeEvent ) => {
    if ( !event.target ) {
      return;
    }

    const { name, value, type } = event.target;

    if ( data.hasOwnProperty( name ) ) {
      setData( {
        ...data,
        [ name ]: type === 'checkbox' ? !data[ name ] : value,
      } );
    }
  };
}

export function useHandleChangeWithState<T extends Object>(dataInit: T) {
  const [data, setData] = useState<T>(dataInit);
  
  return [data, useHandleChange<T>(data, setData)];
}
