import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { TotalEstimatedPrice } from './TotalEstimatedPrice';

const orderLines = [
  { cost: { currency: 'USD', poLineEstimatedPrice: 10.99 } },
  { cost: { currency: 'USD', poLineEstimatedPrice: 20.00 } },
  { cost: { currency: 'EUR', poLineEstimatedPrice: 5.50 } },
  { cost: { currency: 'EUR', poLineEstimatedPrice: 4.50 } },
  { cost: { currency: 'JPY', poLineEstimatedPrice: 1000 } },
];

const defaultProps = {
  orderLines,
};

const renderTotalEstimatedPrice = (props = {}) => render(
  <TotalEstimatedPrice
    {...defaultProps}
    {...props}
  />,
);

describe('TotalEstimatedPrice', () => {
  it('should render estimated price for order lines', () => {
    renderTotalEstimatedPrice();

    expect(screen.getByText('€10.00, ¥1,000, $30.99')).toBeInTheDocument();
  });
});
