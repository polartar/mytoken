import React, { useState } from 'react';

import HodlersList from './HodlersList';
import { JSXElement } from '@babel/types';

const HodlersLists = () => {
  const [selected, setSelected] = useState('whitelist');
  // TODO: This should contain the tab selection and the logic for adding and removing from the lists
  // Filtering should be handled to filter the respective list
  const handleRemove = (list: string, index: number) => console.log('remove from ', list, ' wallet ', index);

  const lists: { [key: string]: JSX.Element } = {
    whitelist: <HodlersList hodlers={ [{ address: 'a whitelist wallet' }]} onRemove={ (index) => handleRemove('whitelist', index) }/>,
    blacklist: <HodlersList hodlers={ [{ address: 'a blacklist wallet' }]} onRemove={ (index) => handleRemove('blacklist', index) }/>,
  };

  return (
    <div>
      <button onClick={ () => setSelected('whitelist')}>WhiteList</button>
      <button onClick={ () => setSelected('blacklist')}>BlockList</button>
      { lists[selected] }
    </div>
  );
};

export default HodlersLists;
