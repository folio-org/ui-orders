import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router';

import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  Tags,
  useLocationsQuery,
} from '@folio/stripes-acq-components';

import {
  orderLine,
  order,
} from 'fixtures';
import {
  match,
  history,
  location,
} from 'fixtures/routerMocks';
import { POLineView } from '../../components/POLine';
import OrderLineDetails from './OrderLineDetails';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  Tags: jest.fn().mockReturnValue('Tags'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useLocationsQuery: jest.fn(() => ({ locations: [] })),
}));
jest.mock('../../components/POLine/POLineView', () => jest.fn().mockReturnValue('POLineView'));

const mutator = {
  orderLine: {
    GET: jest.fn().mockResolvedValue(orderLine),
    PUT: jest.fn().mockResolvedValue(orderLine),
    DELETE: jest.fn().mockResolvedValue(),
  },
  order: {
    GET: jest.fn().mockResolvedValue(order),
  },
  materialTypes: {
    GET: jest.fn(),
  },
  funds: {
    GET: jest.fn(),
  },
};

const defaultProps = {
  refreshList: jest.fn(),
  resources: {},
  match: {
    ...match,
    params: {
      id: orderLine.id,
    },
  },
  location,
  history,
  mutator,
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderOrderLineDetails = (props = {}) => render(
  <OrderLineDetails
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('OrderLineDetails', () => {
  beforeEach(() => {
    useLocationsQuery
      .mockClear()
      .mockReturnValue({ locations: [location] });
  });

  it('should render POLineView', async () => {
    renderOrderLineDetails();

    const component = await screen.findByText(/POLineView/i);

    expect(component).toBeInTheDocument();
  });
});

describe('OrderLineDetails actions', () => {
  beforeEach(() => {
    POLineView.mockClear();
  });

  it('should navigate to order details view', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].goToOrderDetails());

    expect(history.push).toHaveBeenCalledWith({
      pathname: `/orders/view/${order.id}`,
      search: `qindex=poNumber&query=${order.poNumber}`,
    });
  });

  it('should delete order line', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].deleteLine());

    expect(mutator.orderLine.DELETE).toHaveBeenCalled();
  });

  it('should call \'delete\' function even if it is rejected', async () => {
    mutator.orderLine.DELETE.mockRejectedValue();

    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].deleteLine());

    expect(mutator.orderLine.DELETE).toHaveBeenCalled();
  });

  it('should cancel order line', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].cancelLine());

    expect(mutator.orderLine.PUT).toHaveBeenCalled();
  });

  it('should toggle Tags pane', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].tagsToggle());

    expect(screen.getByText(/Tags/i)).toBeInTheDocument();
  });

  it('should close corresponding pane', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].onClose());

    expect(history.push).toHaveBeenCalledWith({
      pathname: '/orders/lines',
      search: location.search,
    });
  });

  it('should update line tag list', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].tagsToggle());
    await waitFor(() => Tags.mock.calls[0][0].putMutator());

    expect(mutator.orderLine.PUT).toHaveBeenCalled();
  });
});
