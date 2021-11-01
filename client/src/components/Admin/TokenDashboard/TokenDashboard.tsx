import React from 'react';

import TokenCard from './TokenCard';
import Filter from '../Filter';

const TokenDashboard = () => {
  // TODO: bring token cards and add filtering logic
  return (
    <div>
      <Filter/>
      <TokenCard tokenId='tok1'/>
      <TokenCard tokenId='tok2'/>
      <TokenCard tokenId='tok3'/>
    </div>
  );
};

export default TokenDashboard;
