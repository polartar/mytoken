import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

type Props = {
  tokenId: string;
};

const TokenCard = ({ tokenId }: Props) => {
  const { url } = useRouteMatch();

  return (
    <div>
      <h3>TokenCard for { tokenId.toUpperCase() }</h3>
      <Link to={ `${url}/${tokenId}` }>Details</Link>
    </div>
  );
};

export default TokenCard;
