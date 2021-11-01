import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const YesNoOptions = [
  'Yes',
  'No',
];

const useYesNoOptions = () => {
  const { t } = useTranslation(['common']);

  return useMemo(() => YesNoOptions.map(o => t(`yesNoOptions.${o}`)), [t]);
};

export default useYesNoOptions;
