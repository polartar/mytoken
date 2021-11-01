import { ComponentType, useEffect } from 'react';

import useIncDec from './useIncDec';
import { ValidationRules } from './useFormValidation';

export type Step = {
  relPath: string,
  component: ComponentType<any>,
  title: string,
  buttons?: string[],
  validationRules?: ValidationRules,
};

const useSteps = ( path: string, steps: Step[], current?: string) => {
  const { inc, dec, index, setIndex } = useIncDec(0, 0, steps.length - 1 );

  useEffect(() => {
    const currentRelPath = (current || '').replace( path, '' );
    const currentIndex = steps.findIndex(s => s.relPath === currentRelPath);
    setIndex(Math.max(currentIndex, 0));
  }, [path, current, steps, setIndex]);

  const nextStep = index < steps.length - 1 && (() => {
    const incremented = inc();
    return `${ path }${ steps[ incremented ].relPath }`;
  });

  const prevStep = index > 0 && (() => {
    const decremented = dec();
    return `${ path }${ steps[ decremented ].relPath }`;
  });

  return {  nextStep, prevStep, currentStep: steps[index] };
};

export default useSteps;