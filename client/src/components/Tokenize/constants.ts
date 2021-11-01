import NameStep from './NameStep';
import ContactStep from './ContactStep';
import TokenStep from './TokenStep';
import AssetStep from './AssetStep';
import OwnerStep from './OwnerStep';
import ReviewStep from './ReviewStep';
import CheckoutStep from './CheckoutStep';
import CoinPaymentStep from './CoinPaymentStep';
import { Step } from '../../shared/hooks/useSteps';
import { ValidationRules } from '../../shared/hooks/useFormValidation';
import { TokenDetails } from '../../redux/tokenize';

export const AssetTypeOptions = [
  { value: 'Real Estate', content: 'Real Estate' },
  { value: 'VC', content: 'Venture Capital' },
  { value: 'PE', content: 'Private Equity' },
  { value: 'Commodities', content: 'Commodities' },
  { value: 'Metals', content: 'Metals' },
  { value: 'Stock', content: 'Stock' },
  { value: 'Bond', content: 'Bond' },
  { value: 'Utility', content: 'Utility' },
  { value: 'Other', content: 'Other' },
];

// Steps Definition
const DefaultButtons = [ 'back', 'next' ];

export const nameValidationRules: ValidationRules = {
  firstName: { required: true },
  lastName: { required: true },
  ownerCompany: { required: true },
};

export const contactValidationRules: ValidationRules = {
  email: { required: true, email: true },
  companyPhone: { required: true },
  website: { required: true, url: true },
};

export const tokenValidationRules: ValidationRules = {
  symbol: { required: true, minLength: 2, maxLength: 5 },
  supply: { required: true, numeric: true },
  title: { required: true },
  assetInfo: { required: true },
};

export const assetValidationRules: ValidationRules = {
  otherAsset: { required: true, conditional: (data: TokenDetails) => data.assetType === 'Other' },
  limitNumber: { required: true, numeric: true, conditional: (data: TokenDetails) => data.hodlersLimit === 'Yes' },
};

const restrictedValidation = (data: TokenDetails) => {
  if (data.tokenDisplay === 'restricted') {
    if (!data.whitelist && !data.allAccredited) {
      return 'ownerStep.tokenDisplay.restrictedRequired';
    }
  }
  return null;
};

export const ownerValidationRules: ValidationRules = {
  ownerETHAddress: { required: true, ethAddress: true },
  tokenDisplay: { custom: restrictedValidation },
};

export const Steps: Step[] = [
  { relPath: '/name', component: NameStep, title: 'defaultTitle', buttons: DefaultButtons, validationRules: nameValidationRules },
  { relPath: '/contact', component: ContactStep, title: 'defaultTitle', buttons: DefaultButtons, validationRules: contactValidationRules },
  { relPath: '/token', component: TokenStep, title: 'defaultTitle', buttons: DefaultButtons, validationRules: tokenValidationRules },
  { relPath: '/asset', component: AssetStep, title: 'defaultTitle', buttons: DefaultButtons, validationRules: assetValidationRules },
  { relPath: '/owner', component: OwnerStep, title: 'defaultTitle', buttons: [ 'back', 'review' ], validationRules: ownerValidationRules },
  { relPath: '/review', component: ReviewStep, title: 'reviewStep.stepTitle', buttons: [ 'back', 'checkout' ] },
  { relPath: '/checkout', component: CheckoutStep, title: 'checkoutStep.stepTitle' },
  { relPath: '/coinPayment', component: CoinPaymentStep, title: 'coinPaymentStep.stepTitle', buttons: [ 'backToHome' ] },
];

export const DefaultStep = Steps[ 0 ];