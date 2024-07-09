import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import { orderLine } from 'fixtures/orderLine';
import { ConsortiumRelatedItemsList } from './ConsortiumRelatedItemsList';
import { useConsortiumPOLineRelatedItems } from '../../../../common/hooks';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useCurrentUserTenants: jest.fn(() => (['central', 'member'])),
}));
jest.mock('../../../../common/hooks', () => ({
  ...jest.requireActual('../../../../common/hooks'),
  useConsortiumPOLineRelatedItems: jest.fn(),
}));

const defaultProps = {
  poLine: orderLine,
};

const items = [{ id: 'item-id' }];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderConsortiumRelatedItemsList = (props = {}) => render(
  <ConsortiumRelatedItemsList
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('ConsortiumRelatedItemsList', () => {
  beforeEach(() => {
    useConsortiumPOLineRelatedItems
      .mockClear()
      .mockReturnValue({ items });
  });

  it('should render MCL with related to POL items', () => {
    renderConsortiumRelatedItemsList();

    expect(screen.getByText('ui-inventory.item.barcode')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.status')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory.copyNumber')).toBeInTheDocument();
  });
});
