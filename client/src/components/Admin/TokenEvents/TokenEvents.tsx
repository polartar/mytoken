import React from 'react';
import { useParams } from 'react-router-dom';

import Filter from '../Filter';

const TokenEvents = () => {
  // TODO: implement token events list and use filter
  const { tokenId } = useParams();
  
  return (
    <div>
      <Filter/>
      <div>TokenEvents for { tokenId.toUpperCase() }</div>
    </div>
  );
};

export default TokenEvents;
