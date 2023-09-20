import { MemoryRouter } from 'react-router';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import POInvoices from './POInvoices';

const defaultProps = {
  orderInvoices: [{
    id: 'invoiceId',
    vendorId: 'vendorId',
    fiscalYearId: 'fiscalYearId',
    vendor: {
      id: 'vendorId',
      code: 'vendorCode',
    },
    fiscalYear: {
      id: 'fiscalYearId',
      code: 'fiscalYearCode',
      description: 'fiscalYearDescription',
      periodStart: '2020-01-01',
    },
  }],
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
    expect(screen.getByText('ui-orders.relatedInvoices.fiscalYear')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.invoiceDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.vendorCode')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.vendorInvoiceNo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.status')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoices.expendedAmount')).toBeInTheDocument();
  });

  it('should not render the component with empty orderInvoices', () => {
    renderPOInvoices({ orderInvoices: [] });

    expect(screen.queryByText('ui-orders.relatedInvoices.invoice')).not.toBeInTheDocument();
  });
});
