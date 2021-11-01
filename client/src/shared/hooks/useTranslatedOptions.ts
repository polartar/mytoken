import { useMemo } from 'react';
import { TFunction } from 'i18next';

import { Options } from './../components/Select';

const useTranslatedOptions = (options: Options, translationPath: string, t: TFunction) => {
  return useMemo(() => options.map(o => {
      if (typeof o === 'string') {
        return t(`${translationPath}.${o}`);
      }
      return {
        ...o,
        label: t(`${translationPath}.${o.value}`),
      };
  }), [t, options, translationPath]);
};

export default useTranslatedOptions;
