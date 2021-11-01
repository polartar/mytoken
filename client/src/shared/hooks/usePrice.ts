import { useState, useEffect } from 'react';
import { getPrice, PriceResponse } from '../../services/tokenizer';

const usePrice = () => {
  const [result, setResult] = useState<PriceResponse | null>(null);

  useEffect(() => {
    getPrice()
      .then(result => setResult(result));
  }, [setResult]);
  
  return {
    price: result?.price,
    minPrice: result?.minPrice,
  };
};

export default usePrice;