import { MemoryRouter } from 'react-router';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { useConnectedInvoiceLines } from './useConnectedInvoiceLines';
import { RelatedInvoiceLines } from './RelatedInvoiceLines';

jest.mock('./useConnectedInvoiceLines', () => ({
  useConnectedInvoiceLines: jest.fn(),
}));

const invoiceLines = [{
  id: 'invoiceLineId',
  invoiceId: 'invoiceId',
  invoiceLineStatus: 'Open',
  invoice: {
    id: 'invoiceId',
  },
  vendor: {
    id: 'vendorId',
    name: 'Amazon',
  },
}];
const defaultProps = {
  lineId: invoiceLines[0].id,
};

const renderRelatedInvoiceLines = (props = {}) => render(
  <RelatedInvoiceLines
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('RelatedInvoiceLines', () => {
  beforeEach(() => {
    useConnectedInvoiceLines.mockClear().mockReturnValue({
      isLoading: false,
      invoiceLines,
    });
  });

  it('should render RelatedInvoiceLines multicolumn list', () => {
    renderRelatedInvoiceLines();

    expect(screen.getByText('ui-orders.relatedInvoiceLines.invoiceLine')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoiceLines.invoiceDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoiceLines.vendorName')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoiceLines.vendorInvoiceNo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoiceLines.status')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoiceLines.quantity')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoiceLines.amount')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.relatedInvoiceLines.comment')).toBeInTheDocument();
  });
});
