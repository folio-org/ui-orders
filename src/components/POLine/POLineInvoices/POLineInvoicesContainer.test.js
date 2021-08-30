import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import POLineInvoicesContainer from './POLineInvoicesContainer';

jest.mock('./POLineInvoices', () => jest.fn().mockReturnValue('POLineInvoices'));

const defaultProps = {
  lineId: '',
  label: <>label</>,
  pieces: {
    GET: jest.fn().mockResolvedValue([]),
  },
  invoices: {
    GET: jest.fn().mockResolvedValue([{
      vendorId: 'vendorId',
    }]),
    reset: jest.fn(),
  },
  invoiceLines: {
    GET: jest.fn().mockResolvedValue([{
      invoiceId: 'invoiceId',
    }]),
  },
  invoiceLinesVendors: {
    GET: jest.fn().mockResolvedValue([]),
  },
};

const renderPOLineInvoicesContainer = (props = {}) => render(
  <POLineInvoicesContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('POLineInvoicesContainer', () => {
  it('should render POLineInvoices', async () => {
    renderPOLineInvoicesContainer();

    await waitFor(() => expect(screen.getByText(/POLineInvoices/i)).toBeInTheDocument());
  });
});
