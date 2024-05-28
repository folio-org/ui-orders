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
  location,
  orderLine,
  order,
} from 'fixtures';
import { history } from 'fixtures/routerMocks';
import POLine from './POLine';
import POLineView from './POLineView';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  Tags: jest.fn().mockReturnValue('Tags'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useLocationsQuery: jest.fn(() => ({ locations: [] })),
}));
jest.mock('../../common/hooks', () => ({
  useOrderTemplate: jest.fn().mockResolvedValue({
    isLoading: false,
    orderTemplate: {},
  }),
  useOrder: jest.fn().mockResolvedValue({
    isLoading: false,
    order: {},
  }),
}));
jest.mock('./POLineView', () => jest.fn().mockReturnValue('POLineView'));

const defaultProps = {
  history,
  location: {
    search: '',
  },
  match: {
    params: {
      id: order.id,
      lineId: orderLine.id,
    },
  },
  mutator: {
    lineOrder: {
      GET: jest.fn().mockResolvedValue([order]),
    },
    contributorNameTypes: {
      GET: jest.fn().mockResolvedValue(),
    },
    poLine: {
      GET: jest.fn().mockResolvedValue([orderLine]),
      PUT: jest.fn().mockResolvedValue(),
      DELETE: jest.fn().mockResolvedValue(),
    },
    fund: {
      GET: jest.fn().mockResolvedValue(),
    },
    materialTypes: {
      GET: jest.fn().mockResolvedValue(),
    },
  },
  poURL: '',
  resources: {},
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

const renderPOLine = (props = {}) => render(
  <POLine
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('POLine', () => {
  it('should render POLineView', async () => {
    renderPOLine();

    const view = await screen.findByText(/POLineView/i);

    expect(view).toBeInTheDocument();
  });
});

describe('POLine actions', () => {
  beforeEach(() => {
    POLineView.mockClear();
    history.push.mockClear();
    defaultProps.mutator.lineOrder.GET.mockClear();
    defaultProps.mutator.poLine.GET.mockClear().mockResolvedValue([orderLine]);
    defaultProps.mutator.poLine.PUT.mockClear();
    defaultProps.mutator.poLine.DELETE.mockClear();
    useLocationsQuery
      .mockClear()
      .mockReturnValue({ locations: [location] });
  });

  it('should close POLineView and back to order', async () => {
    renderPOLine();

    await waitFor(() => POLineView.mock.calls[0][0].onClose());

    expect(history.push).toHaveBeenCalledWith({
      pathname: defaultProps.poURL,
      search: defaultProps.location.search,
    });
  });

  it('should delete POLine', async () => {
    renderPOLine();

    await waitFor(() => POLineView.mock.calls[0][0].deleteLine());

    expect(defaultProps.mutator.poLine.DELETE).toHaveBeenCalled();
  });

  it('should cancel POLine', async () => {
    renderPOLine();

    await waitFor(() => POLineView.mock.calls[0][0].cancelLine());

    expect(defaultProps.mutator.poLine.PUT).toHaveBeenCalled();
  });

  it('should open Tags pane', async () => {
    renderPOLine();

    await waitFor(() => POLineView.mock.calls[0][0].tagsToggle());

    expect(screen.getByText(/Tags/i)).toBeInTheDocument();
  });

  it('should close corresponding pane', async () => {
    renderPOLine();

    await waitFor(() => POLineView.mock.calls[0][0].onClose());

    expect(history.push).toHaveBeenCalled();
  });

  it('should update line tag list', async () => {
    renderPOLine();

    await waitFor(() => POLineView.mock.calls[0][0].tagsToggle());
    await waitFor(() => Tags.mock.calls[0][0].putMutator());

    expect(defaultProps.mutator.poLine.PUT).toHaveBeenCalled();
  });

  describe('POLine actions error handling', () => {
    it('should handle error on order line loading', async () => {
      defaultProps.mutator.poLine.GET.mockRejectedValue();

      renderPOLine();

      expect(defaultProps.mutator.poLine.GET).toHaveBeenCalled();
    });

    it('should handle error on delete', async () => {
      defaultProps.mutator.poLine.DELETE.mockRejectedValue();

      renderPOLine();

      await waitFor(() => POLineView.mock.calls[0][0].deleteLine());

      expect(defaultProps.mutator.poLine.DELETE).toHaveBeenCalled();
    });

    it('should handle error on line cancellation', async () => {
      defaultProps.mutator.poLine.PUT.mockRejectedValue();

      renderPOLine();

      await waitFor(() => POLineView.mock.calls[0][0].cancelLine());

      expect(defaultProps.mutator.poLine.PUT).toHaveBeenCalled();
    });
  });
});
