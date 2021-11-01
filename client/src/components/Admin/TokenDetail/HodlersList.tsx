import React from 'react';

type Props = {
  hodlers: { address: string }[],
  onRemove: (index: number) => any,
};

const HodlersList = (props: Props) => {
  // TODO: Implement a generic list of wallets with remove functionality
  // It should be generic for both whitelist and blancklist, logic will be handler on HodlerLists
  const {
    hodlers = [],
    onRemove = () => { },
  } = props;

  return (
    <div>
      { hodlers.map((hodler, index) => (
        <div key={ hodler.address }>
          <span>{ hodler.address }</span>
          <button onClick={ () => onRemove(index) }>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default HodlersList;
