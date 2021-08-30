import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import POLineInvoices from './POLineInvoices';

const defaultProps = {
  lineInvoices: [{
    id: 'invoiceId',
  }],
  invoiceLines: [{
    invoiceId: 'invoiceId',
  }],
  vendors: [],
  pieces: [{
    enumeration: 'enumeration',
  }],
};

const renderPOLineInvoices = (props = {}) => render(
  <POLineInvoices
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('POLineInvoices', () => {
  it('should render POLineInvoices multicolumn list', () => {
    renderPOLineInvoices();

    expect(screen.getByText('ui-orders.relatedInvoices.invoice')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.invoiceDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.vendorName')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.vendorInvoiceNo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.status')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.quantity')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.expendedAmount')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.pieces')).toBeInTheDocument();
  });
});
