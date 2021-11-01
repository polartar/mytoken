import { useCallback } from 'react';

const basePath = '/assets/cryptocurrency-icons';

const useCoinLogo = (defStyle = 'icon', defSize: string | number = 'svg') => {
  return useCallback(
    (coin: string, style = defStyle, size = defSize) => `${basePath}/${size}/${style}/${coin.toLowerCase()}.${defSize === 'svg' ? 'svg' : 'png'}`,
    [defStyle, defSize],
  );
};

export default useCoinLogo;
