import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useExchangeCalculation } from '../hooks';
import { CalculatedExchangeAmount } from './CalculatedExchangeAmount';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AmountWithCurrencyField: jest.fn(() => 'AmountWithCurrencyField'),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useExchangeCalculation: jest.fn(),
}));

const messageId = 'ui-orders.cost.calculatedTotalExchangeAmount';
const renderComponent = (props = {}) => render(
  <CalculatedExchangeAmount {...props} />,
);

describe('CalculatedExchangeAmount', () => {
  beforeEach(() => {
    useExchangeCalculation.mockClear().mockReturnValue({
      isLoading: false,
      exchangedAmount: 30,
    });
  });

  it('should render calculated exchange amount', () => {
    renderComponent({
      currency: 'EUR',
      exchangeRate: 1,
      total: 30,
    });

    expect(screen.getByText(messageId)).toBeInTheDocument();
  });

  describe('should not render component when ', () => {
    it('currency is the same as system currency', () => {
      renderComponent({
        currency: 'USD',
        exchangeRate: 1,
        total: 30,
      });

      expect(screen.queryByText(messageId)).not.toBeInTheDocument();
    });

    it('amount is not available', () => {
      renderComponent({
        currency: 'USD',
        exchangeRate: 1,
        total: undefined,
      });

      expect(screen.queryByText(messageId)).not.toBeInTheDocument();
    });
  });
});
