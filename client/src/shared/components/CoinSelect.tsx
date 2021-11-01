import React from 'react';
import ReactImageFallback from 'react-image-fallback';
import { components, ValueType } from 'react-select';
import AsyncSelect from 'react-select/async';

import useCoinLogo from '../hooks/useCoinLogo';

import './CoinSelect.scss';
import { ChangeEvent } from '../hooks/useHandleChange';
import classNames from 'classnames';

type OptionType = ValueType<{
  value: string,
  label: string,
}>;

const Top10 = [
  'ETH',
  'BTC',
  'USDT',
  'USDC',
  'DAI',
  'XRP',
  'BCH',
  'LTC',
  'EOS',
  'XMR',
];

type Props = {
  id: string,
  name: string,
  coins?: string[],
  className?: string,
  onChange?: ( event: ChangeEvent ) => void,
  value?: string,
  textMuted?: string,
  disabled?: boolean,
};

const CoinSelect = ( props: Props ) => {
  const {
    id,
    name,
    coins = Top10,
    className,
    onChange = () => { },
    value,
    textMuted,
    disabled = false,
  } = props;
  const coinOptions = (coins.length ? coins : Top10).map(coin => ({ value: coin, label: coin}));
  const selected = coinOptions.find(coin => coin.value === value) || coinOptions[0];

  const handleChange = (selection: OptionType) => { 
    if (selection && 'value' in selection ) {
      onChange({
        target: {
          name,
          value: selection.value,
        },
      });
    }
  };

  const loadOptions = (inputValue: string) => new Promise(resolve => {
    if (inputValue === '') {
      resolve(coinOptions.slice(0, 10));
    } else {
      resolve(
        coinOptions
        .filter(coin => coin.label.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 10),
      );
    }
  });

  return (
    <div className={ classNames('coin-select', className) }>
      <AsyncSelect
        id={ id }
        name={ name }
        components={ { 
          Option: CoinOption,
          Input: (props) => <CoinInput { ...props } selected={ selected } />,
          SingleValue: CoinSingleValue,
        } }
        defaultOptions={ coinOptions.slice(0, 10) }
        loadOptions={ loadOptions }
        value={ selected }
        onChange={ handleChange }
        isDisabled={ disabled }
      />
      { textMuted && <small className='text-muted error form-text'>{ textMuted }</small> }
    </div>
  );
};

const CoinInput = ( props: any ) => (
  <div className='coin-option-input'>
    <components.Input { ...props } />
  </div>
);

const CoinSingleValue = ( { children, data, ...props }: any ) => {
  const coinLogoUrl = useCoinLogo();

  return (
    <div className='coin-option'>
      <ReactImageFallback
					src={ coinLogoUrl(data.value) }
					fallbackImage={ coinLogoUrl('generic') }
					initialImage={ coinLogoUrl('generic') }
					alt={ `${ data.label } logo` }/>
      <span className='label'>
        <components.SingleValue { ...props }>{ children }</components.SingleValue>
      </span>
    </div>
  );
};

const CoinOption = ( props: any ) => {
  const { label } = props;
  const coinLogoUrl = useCoinLogo();

  return (
    <div className='coin-option'>
      <ReactImageFallback
					src={ coinLogoUrl(label) }
					fallbackImage={ coinLogoUrl('generic') }
					initialImage={ coinLogoUrl('generic') }
					alt={ `${ label } logo` }/>
      <span className='label'>
        <components.Option { ...props } />
      </span>
    </div>
  );
};

export default CoinSelect;