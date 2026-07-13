import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { usePaymentTermsFiscalYears } from '../../PaymentTerms/hooks';
import { PaymentTermsVersionViewContent } from './PaymentTermsVersionViewContent';
import { PaymentTermsVersionView } from './PaymentTermsVersionView';

jest.mock('../../PaymentTerms/hooks', () => ({
  usePaymentTermsFiscalYears: jest.fn(() => ({ fiscalYears: [], isFetching: false })),
}));

jest.mock('./PaymentTermsVersionViewContent', () => ({
  PaymentTermsVersionViewContent: jest.fn(() => 'PaymentTermsVersionViewContent'),
}));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn(() => <span data-testid="loading">Loading</span>),
}));

const defaultVersion = {
  cost: { currency: 'USD' },
  paymentTerms: {
    startingFiscalYearId: 'fy1',
    totalPrice: 1000,
    fiscalYearDistributions: [],
  },
};

const renderComponent = (props = {}) => render(
  <PaymentTermsVersionView
    version={defaultVersion}
    {...props}
  />,
);

const getContentProps = () => PaymentTermsVersionViewContent.mock.calls.at(-1)[0];

describe('PaymentTermsVersionView', () => {
  afterEach(() => {
    jest.clearAllMocks();
    usePaymentTermsFiscalYears.mockReturnValue({ fiscalYears: [], isFetching: false });
  });

  it('should render PaymentTermsVersionViewContent when not fetching', () => {
    renderComponent();

    expect(screen.getByText('PaymentTermsVersionViewContent')).toBeInTheDocument();
  });

  it('should show Loading while fetching', () => {
    usePaymentTermsFiscalYears.mockReturnValue({ fiscalYears: [], isFetching: true });
    renderComponent();

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByText('PaymentTermsVersionViewContent')).not.toBeInTheDocument();
  });

  it('should pass currency and paymentTerms to PaymentTermsVersionViewContent', () => {
    renderComponent();

    expect(getContentProps().currency).toBe('USD');
    expect(getContentProps().paymentTerms).toBe(defaultVersion.paymentTerms);
  });

  it('should pass a fiscalYearsMap built from fetched fiscal years', () => {
    const fy = { id: 'fy1', code: 'FY2026' };

    usePaymentTermsFiscalYears.mockReturnValue({ fiscalYears: [fy], isFetching: false });
    renderComponent();

    const { fiscalYearsMap } = getContentProps();

    expect(fiscalYearsMap.get('fy1')).toBe(fy);
  });

  it('should call usePaymentTermsFiscalYears with startingFiscalYearId', () => {
    renderComponent();

    expect(usePaymentTermsFiscalYears).toHaveBeenCalledWith('fy1');
  });

  it('should call usePaymentTermsFiscalYears with undefined when startingFiscalYearId is absent', () => {
    renderComponent({ version: { cost: { currency: 'USD' }, paymentTerms: {} } });

    expect(usePaymentTermsFiscalYears).toHaveBeenCalledWith(undefined);
  });
});
