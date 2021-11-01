import React from 'react';

import './Loading.scss';

type Props = {
  height?: number;
};

const LoadingContent = ({ height }: Props) => (
  <div className='loading content' style={ { minHeight: `${height}px` ||  '200px' } }>
    <div className='loader'>Loading...</div>
  </div>
);

export default LoadingContent;
