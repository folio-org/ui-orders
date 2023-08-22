import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import POInvoicesContainer from './POInvoicesContainer';
import { useRelatedInvoices } from './useRelatedInvoices';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: jest.fn().mockReturnValue('Loading'),
}));
jest.mock('./useRelatedInvoices', () => ({
  useRelatedInvoices: jest.fn().mockReturnValue({ isLoading: false, orderInvoices: [{}] }),
}));
jest.mock('./POInvoices', () => jest.fn().mockReturnValue('POInvoices'));

const defaultProps = {
  label: 'label',
  orderInvoicesIds: ['orderInvoicesIds'],
};

const renderPOInvoices = (props = {}) => render(
  <POInvoicesContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('POInvoicesContainer', () => {
  it('should render POInvoicesContainer', () => {
    renderPOInvoices();

    expect(screen.getByText('POInvoices')).toBeInTheDocument();
  });

  it('should not render the component with `isLoading: true`', () => {
    useRelatedInvoices.mockReturnValueOnce({ isLoading: true });
    renderPOInvoices({ orderInvoices: [] });

    expect(screen.queryByText('Loading')).toBeInTheDocument();
  });
});
