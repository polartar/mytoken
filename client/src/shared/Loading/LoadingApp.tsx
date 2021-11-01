import React from 'react';

import './Loading.scss';

type Props = {
  status: string;
};

const LoadingApp = (props: Props) => {
  const { status } = props;

  return (
    <div className='loading app'>
      <img
        src='https://cdn2.bytetrade.io/2e4add5483abf2ff/c7763b7a907c172c7c5eb5cbb59447f2.png'
        alt='Tokenizer'
      />
      <div className='loader'>Loading...</div>
      <h3>{ status }</h3>
    </div>
  );
};

export default LoadingApp;
