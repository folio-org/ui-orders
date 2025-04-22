import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useLocationsQuery,
  useOrganization,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  order,
  orderLine,
  vendor,
} from 'fixtures';
import {
  history,
  location,
  match,
} from 'fixtures/routerMocks';
import { SUBMIT_ACTION_FIELD } from '../../common/constants';
import {
  useOrder,
  useOrderLine,
} from '../../common/hooks';
import ModalDeletePieces from '../ModalDeletePieces';
import { SUBMIT_ACTION } from '../POLine/const';
import POLineForm from '../POLine/POLineForm';
import { updateOrderResource } from '../Utils/orderResource';
import LayerPOLine from './LayerPOLine';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useIntegrationConfigs: jest.fn().mockReturnValue({ integrationConfigs: [], isLoading: false }),
  useLocationsQuery: jest.fn(),
  useOrganization: jest.fn(),
  useShowCallout: jest.fn(),
}));
jest.mock('../../common/hooks', () => ({
  useOpenOrderSettings: jest.fn().mockReturnValue({ isFetching: false, openOrderSettings: {} }),
  useLinesLimit: jest.fn().mockReturnValue({ isLoading: false, linesLimit: 1 }),
  useOrder: jest.fn(),
  useOrderLine: jest.fn(),
  useInstance: jest.fn().mockReturnValue({ isLoading: false, instance: {} }),
  useTitleMutation: jest.fn().mockReturnValue({ mutateTitle: jest.fn().mockReturnValue(() => Promise.resolve()) }),
}));
jest.mock('../POLine/POLineForm', () => jest.fn().mockReturnValue('POLineForm'));
jest.mock('../ModalDeletePieces', () => jest.fn().mockReturnValue('ModalDeletePieces'));
jest.mock('../../common/utils', () => ({
  ...jest.requireActual('../../common/utils'),
  validateDuplicateLines: jest.fn().mockReturnValue(Promise.resolve()),
}));
jest.mock('../Utils/orderResource', () => ({
  ...jest.requireActual('../Utils/orderResource'),
  updateOrderResource: jest.fn(() => Promise.resolve()),
}));

const queryClient = new QueryClient();

const defaultProps = {
  mutator: {
    lineOrder: {
      POST: jest.fn().mockResolvedValue(order),
      PUT: jest.fn().mockResolvedValue(order),
    },
    approvalsSetting: {
      GET: jest.fn().mockResolvedValue(),
    },
    contributorNameTypes: {
      GET: jest.fn().mockResolvedValue(),
    },
    poLines: {
      GET: jest.fn().mockResolvedValue([orderLine]),
      PUT: jest.fn().mockResolvedValue(orderLine),
      POST: jest.fn().mockResolvedValue(orderLine),
    },
    createInventory: {
      GET: jest.fn().mockResolvedValue(),
    },
    orderTemplates: {
      GET: jest.fn().mockResolvedValue(),
    },
    materialTypes: {
      GET: jest.fn().mockResolvedValue(),
    },
    identifierTypes: {
      GET: jest.fn().mockResolvedValue(),
    },
    orderNumber: {
      GET: jest.fn().mockResolvedValue({ poNumber: '10000' }),
    },
  },
  resources: {
    createInventory: {
      hasLoaded: true,
    },
    approvalsSetting: {
      hasLoaded: true,
    },
    contributorNameTypes: {
      hasLoaded: true,
    },
    orderTemplates: {
      hasLoaded: true,
    },
    identifierTypes: {
      hasLoaded: true,
    },
    materialTypes: {
      hasLoaded: true,
    },
  },
  match: {
    ...match,
    params: {
      id: order.id,
      lineId: orderLine.id,
    },
  },
  location,
  history,
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderLayerPOLine = (props = {}) => render(
  <LayerPOLine
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

const mockShowCallout = jest.fn();
const refetchOrderLine = jest.fn();

describe('LayerPOLine', () => {
  beforeEach(() => {
    useOrder.mockReturnValue({
      isLoading: false,
      order: { ...order, poLines: [] },
    });
    useOrderLine.mockReturnValue({
      isLoading: false,
      orderLine,
      refetch: refetchOrderLine,
    });
    useOrganization.mockReturnValue({ organization: vendor });
    useLocationsQuery.mockReturnValue({ locations: [location] });
    useShowCallout.mockReturnValue(mockShowCallout);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render POLineForm', async () => {
    renderLayerPOLine();

    const form = await screen.findByText('POLineForm');

    expect(form).toBeInTheDocument();
  });

  it('should create POLine', async () => {
    renderLayerPOLine({ match: {
      ...match,
      params: {
        id: order.id,
      },
    } });

    await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({ isAcknowledged: true }));

    expect(defaultProps.mutator.poLines.POST).toHaveBeenCalled();
  });

  it('should update POLine', async () => {
    renderLayerPOLine();

    await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({
      ...orderLine,
      [SUBMIT_ACTION_FIELD]: SUBMIT_ACTION.saveAndOpen,
    }));

    expect(defaultProps.mutator.poLines.PUT).toHaveBeenCalled();
  });

  describe('Alternative submit actions', () => {
    const submitWithType = (submitAction) => () => {
      return POLineForm.mock.calls[0][0].onSubmit({
        ...orderLine,
        [SUBMIT_ACTION_FIELD]: submitAction,
      });
    };

    describe('Add PO Line', () => {
      it('should create POLine and keep the edit form opened', async () => {
        renderLayerPOLine({
          match: {
            ...match,
            params: { id: order.id },
          },
        });

        await waitFor(submitWithType(SUBMIT_ACTION.saveAndKeepEditing));

        expect(defaultProps.mutator.poLines.POST).toHaveBeenCalled();
        expect(history.push).toHaveBeenCalledWith(expect.objectContaining({
          pathname: expect.stringMatching(/orders\/view\/.*\/po-line\/edit\/.*/),
        }));
      });

      it('should create POLine and open the form for another PO Line', async () => {
        renderLayerPOLine({
          match: {
            ...match,
            params: { id: order.id },
          },
        });

        await waitFor(submitWithType(SUBMIT_ACTION.saveAndCreateAnother));

        expect(defaultProps.mutator.poLines.POST).toHaveBeenCalled();
        expect(history.push).toHaveBeenCalledWith(expect.objectContaining({
          pathname: expect.stringMatching(/orders\/view\/.*\/po-line\/create/),
        }));
      });

      it('should create POLine and open the order', async () => {
        renderLayerPOLine({
          match: {
            ...match,
            params: { id: order.id },
          },
        });

        await waitFor(submitWithType(SUBMIT_ACTION.saveAndOpen));

        expect(defaultProps.mutator.poLines.POST).toHaveBeenCalled();
        expect(updateOrderResource).toHaveBeenCalled();
      });
    });

    describe('Update PO Line', () => {
      it('should update POLine and keep the edit form opened', async () => {
        renderLayerPOLine();

        await waitFor(submitWithType(SUBMIT_ACTION.saveAndKeepEditing));

        expect(defaultProps.mutator.poLines.PUT).toHaveBeenCalled();
        expect(refetchOrderLine).toHaveBeenCalled();
      });

      it('should update POLine and open the order', async () => {
        renderLayerPOLine();

        await waitFor(submitWithType(SUBMIT_ACTION.saveAndOpen));

        expect(defaultProps.mutator.poLines.PUT).toHaveBeenCalled();
        expect(updateOrderResource).toHaveBeenCalled();
      });
    });
  });

  it('should call onCancel if cancelling', async () => {
    renderLayerPOLine();

    await waitFor(() => POLineForm.mock.calls[0][0].onCancel());

    expect(history.push).toHaveBeenCalled();
  });

  describe('LinesLimit', () => {
    it('should render \'LinesLimit\' modal if \'polLimitExceeded\' error occurs and closed when confirmed', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      defaultProps.mutator.poLines.PUT.mockImplementation(() => Promise.reject({
        errors: [{
          code: 'polLimitExceeded',
        }],
      }));

      renderLayerPOLine();

      await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({}));

      const okBtn = await screen.findByText(/ui-orders.linesLimit.okBtn/i);

      await user.click(okBtn);

      expect(screen.queryByText(/ui-orders.linesLimit.okBtn/i)).not.toBeInTheDocument();
    });

    it('should redirect to order creation', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      defaultProps.mutator.poLines.PUT.mockImplementation(() => Promise.reject({
        errors: [{
          code: 'polLimitExceeded',
        }],
      }));

      renderLayerPOLine();

      await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({}));

      const createBtn = await screen.findByText(/ui-orders.linesLimit.createBtn/i);

      await user.click(createBtn);

      await waitFor(() => expect(history.push).toHaveBeenCalled());
    });
  });

  describe('ModalDeletePieces', () => {
    it('should render \'ModalDeletePieces\' and close it when cancelling', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      defaultProps.mutator.poLines.PUT.mockImplementation(() => Promise.reject({
        errors: [{
          code: 'piecesNeedToBeDeleted',
        }],
      }));

      renderLayerPOLine();

      await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({}));

      const modal = await screen.findByText(/ModalDeletePieces/i);

      expect(modal).toBeInTheDocument();

      await waitFor(() => ModalDeletePieces.mock.calls[0][0].onCancel());

      expect(screen.queryByText(/ModalDeletePieces/i)).not.toBeInTheDocument();
    });

    it('should update POLine when piece was deleted', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      defaultProps.mutator.poLines.PUT.mockImplementation(() => Promise.reject({
        errors: [{
          code: 'piecesNeedToBeDeleted',
        }],
      }));

      renderLayerPOLine();

      await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({}));
      await waitFor(() => ModalDeletePieces.mock.calls[0][0].onSubmit());
      await waitFor(() => expect(defaultProps.mutator.poLines.PUT).toHaveBeenCalled());
    });
  });

  describe('Different account numbers', () => {
    it('should render \'Different account numbers\' modal if error occurs', async () => {
      useOrder.mockClear().mockReturnValue({
        isLoading: false,
        order: {
          ...order,
          poLines: [
            { automaticExport: true, vendorDetail: { vendorAccount: '12345' } },
            { automaticExport: true, vendorDetail: { vendorAccount: '54321' } },
          ],
        },
      });
      defaultProps.mutator.poLines.PUT.mockReturnValue(Promise.resolve());

      renderLayerPOLine();

      await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({ [SUBMIT_ACTION_FIELD]: SUBMIT_ACTION.saveAndOpen }));

      const modal = await screen.findByText(/ui-orders.differentAccounts.title/i);

      expect(modal).toBeInTheDocument();
    });
  });

  it.each([
    ['someError', 'error message'],
    ['genericError', 'Invalid token'],
  ])('should handle \'%s\' error', async (code, message) => {
    useOrganization.mockImplementationOnce(async (_id, { onError }) => {
      await onError({
        clone: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({ errors: [{ message: '' }] }),
      });

      return { organization: null };
    });

    // eslint-disable-next-line prefer-promise-reject-errors
    defaultProps.mutator.poLines.PUT.mockImplementation(() => Promise.reject({
      errors: [{
        code,
        message,
      }],
    }));

    renderLayerPOLine();

    await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({}));

    expect(defaultProps.mutator.poLines.PUT).toHaveBeenCalled();
    expect(mockShowCallout).toHaveBeenCalled();
  });
});
