import { useState, useCallback } from 'react';

const useIncDec = ( init: number, from: number, to: number ) => {
  let [ index, setIndex ] = useState( init );

  const inc = useCallback( () => {
    if ( index < to ) {
      index++;
      setIndex( index );
    }
    return index;
  }, [ index, setIndex, to ] );

  const dec = useCallback( () => {
    if ( index > from ) {
      index--;
      setIndex( index );
    }
    return index;
  }, [ index, setIndex, from ] );

  return { inc, dec, index, setIndex };
};

export default useIncDec;