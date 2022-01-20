import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router';
import user from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';

import LayerPOLine from './LayerPOLine';
import POLineForm from '../POLine/POLineForm';
import ModalDeletePieces from '../ModalDeletePieces';

import { location, history, match } from '../../../test/jest/routerMocks';
import {
  order,
  orderLine,
  vendor,
} from '../../../test/jest/fixtures';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useIntegrationConfigs: jest.fn().mockReturnValue({ integrationConfigs: [], isLoading: false }),
}));
jest.mock('../../common/hooks', () => ({
  useOpenOrderSettings: jest.fn().mockReturnValue({ isFetching: false, openOrderSettings: {} }),
  useLinesLimit: jest.fn().mockReturnValue({ isLoading: false, linesLimit: 1 }),
}));
jest.mock('../POLine/POLineForm', () => jest.fn().mockReturnValue('POLineForm'));
jest.mock('../ModalDeletePieces', () => jest.fn().mockReturnValue('ModalDeletePieces'));

const queryClient = new QueryClient();

const defaultProps = {
  mutator: {
    lineOrder: {
      GET: jest.fn().mockResolvedValue(order),
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
    orderVendor: {
      GET: jest.fn().mockResolvedValue(vendor),
    },
    createInventory: {
      GET: jest.fn().mockResolvedValue(),
    },
    orderTemplates: {
      GET: jest.fn().mockResolvedValue(),
    },
    locations: {
      GET: jest.fn().mockResolvedValue(),
    },
    materialTypes: {
      GET: jest.fn().mockResolvedValue(),
    },
    validateISBN: {
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
    lineOrder: {
      hasLoaded: true,
      records: [order],
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
    locations: {
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

// eslint-disable-next-line react/prop-types
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

describe('LayerPOLine', () => {
  beforeEach(() => {
    POLineForm.mockClear();
    history.push.mockClear();
    defaultProps.mutator.poLines.PUT.mockClear();
  });

  it('should render POLineForm', async () => {
    renderLayerPOLine();

    const form = await screen.findByText('POLineForm');

    expect(form).toBeInTheDocument();
  });

  it('should update POLine', async () => {
    renderLayerPOLine();

    await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({
      ...orderLine,
      saveAndOpen: true,
    }));

    expect(defaultProps.mutator.poLines.PUT).toHaveBeenCalled();
  });

  it('should call onCancel if cancelling', async () => {
    renderLayerPOLine();

    await waitFor(() => POLineForm.mock.calls[0][0].onCancel());

    expect(history.push).toHaveBeenCalled();
  });

  describe('LinesLimit', () => {
    it('should render \'LinesLimit\' modal if \'polLimitExceeded\' error occurs and closed when confirmed', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      defaultProps.mutator.poLines.PUT.mockReturnValue(Promise.reject({
        errors: [{
          code: 'polLimitExceeded',
        }],
      }));

      renderLayerPOLine();

      await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({}));

      const okBtn = await screen.findByText(/ui-orders.linesLimit.okBtn/i);

      user.click(okBtn);

      expect(screen.queryByText(/ui-orders.linesLimit.okBtn/i)).not.toBeInTheDocument();
    });

    it('should redirect to order creation', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      defaultProps.mutator.poLines.PUT.mockReturnValue(Promise.reject({
        errors: [{
          code: 'polLimitExceeded',
        }],
      }));

      renderLayerPOLine();

      await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({}));

      const createBtn = await screen.findByText(/ui-orders.linesLimit.createBtn/i);

      user.click(createBtn);

      await waitFor(() => expect(history.push).toHaveBeenCalled());
    });
  });

  describe('ModalDeletePieces', () => {
    it('should render \'ModalDeletePieces\' and close it when cancelling', async () => {
      // eslint-disable-next-line prefer-promise-reject-errors
      defaultProps.mutator.poLines.PUT.mockReturnValue(Promise.reject({
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
      defaultProps.mutator.poLines.PUT.mockReturnValue(Promise.reject({
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

  it('should handle another errors', async () => {
    // eslint-disable-next-line prefer-promise-reject-errors
    defaultProps.mutator.poLines.PUT.mockReturnValue(Promise.reject({
      errors: [{
        code: 'someError',
      }],
    }));

    renderLayerPOLine();

    await waitFor(() => POLineForm.mock.calls[0][0].onSubmit({}));

    expect(defaultProps.mutator.poLines.PUT).toHaveBeenCalled();
  });
});
