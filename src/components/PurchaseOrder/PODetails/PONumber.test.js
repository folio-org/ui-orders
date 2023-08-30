import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import PONumber from './PONumber';

const renderPONumber = (props = {}) => render(
  <PONumber
    {...props}
  />,
);

describe('PONumber', () => {
  it('should render \'PO number\' field', () => {
    renderPONumber();

    expect(screen.getByText('ui-orders.orderDetails.poNumber')).toBeInTheDocument();
  });
});
