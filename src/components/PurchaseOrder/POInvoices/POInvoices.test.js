import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import POInvoices from './POInvoices';

const defaultProps = {
  orderInvoices: [{}],
  vendors: [{}],
};

const renderPOInvoices = (props = {}) => render(
  <POInvoices
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('POInvoices', () => {
  it('should render POInvoices multicolumn list', () => {
    renderPOInvoices();

    expect(screen.getByText('ui-orders.relatedInvoices.invoice')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.invoiceDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.vendorCode')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.vendorInvoiceNo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.status')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.expendedAmount')).toBeInTheDocument();
  });
});
