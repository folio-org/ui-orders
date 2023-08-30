import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { orderLine } from 'fixtures/orderLine';
import { RelatedItemsList } from './RelatedItemsList';

jest.mock('../../../../common/hooks', () => ({
  ...jest.requireActual('../../../../common/hooks'),
  usePOLineRelatedItems: jest.fn(() => ({
    items: [{}],
    itemsCount: 1,
    isLoading: false,
    isFetching: false,
  })),
}));

const defaultProps = {
  poLine: orderLine,
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderRelatedItemsList = (props = {}) => render(
  <RelatedItemsList
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('RelatedItemsList', () => {
  it('should render MCL with related to POL items', () => {
    renderRelatedItemsList();

    expect(screen.getByText('ui-inventory.item.barcode')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.status')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.copyNumber')).toBeInTheDocument();
  });
});
