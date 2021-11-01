import React from 'react';
import { Link, useParams, useRouteMatch } from 'react-router-dom';

import TransferCard from './TransferCard';
import PieChartCard from './PieChartCard';
import HodlersLists from './HodlersLists';
import Filter from '../Filter';

const TokenDetail = () => {
  const { tokenId } = useParams();
  const { url } = useRouteMatch();

  return (
    <div>
      <h3>TokenDetail for { tokenId.toUpperCase() }</h3>
      <Link to={ `${url}/events` }>Events</Link>
      <TransferCard />
      <PieChartCard />
      <Filter />
      <HodlersLists />
    </div>
  );
};

export default TokenDetail;
