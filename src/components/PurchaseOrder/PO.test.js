import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  MemoryRouter,
  Route,
} from 'react-router-dom';

import {
  act,
  render,
  screen,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import { history } from 'fixtures/routerMocks';
import { ORDERS_ROUTE } from '../../common/constants';
import { useOrderLinesAbandonedHoldingsCheck } from '../../common/hooks';
import {
  useOrderMutation,
  usePurchaseOrderResources,
} from './hooks';
import PO from './PO';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/hooks/useAcqRestrictions', () => ({
  useAcqRestrictions: jest.fn().mockReturnValue({ restrictions: {} }),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewCustomFieldsRecord: jest.fn().mockReturnValue('ViewCustomFieldsRecord'),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useOrderLinesAbandonedHoldingsCheck: jest.fn(() => ({ isFetching: false, result: { type: 'withoutPieces' } })),
  useHandleOrderUpdateError: jest.fn(() => [jest.fn()]),
}));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useOrderMutation: jest.fn(() => ({ updateOrder: jest.fn(() => Promise.resolve()) })),
  usePurchaseOrderResources: jest.fn(),
}));

const ORDER = {
  id: '73a9b376-844f-41b5-8b3f-71f2fae63f1f',
  workflowStatus: ORDER_STATUSES.open,
  poLines: [{
    cost: {
      quantityPhysical: 1,
    },
    lastEDIExportDate: '2022-90-31T00:00:00.000Z',
  }],
};

const defaultProps = {
  refreshList: jest.fn(),
  resources: {
    closingReasons: {
      records: [{
        id: 'id',
        reason: 'reason',
      }],
    },
  },
  mutator: {
    orderDetails: {
      POST: jest.fn().mockResolvedValue(ORDER),
      PUT: jest.fn().mockResolvedValue(ORDER),
      DELETE: jest.fn().mockResolvedValue(ORDER),
    },
    updateEncumbrances: {
      POST: jest.fn().mockResolvedValue(),
    },
    generatedOrderNumber: {
      GET: jest.fn().mockResolvedValue({ poNumber: 1000 }),
    },
  },
  history,
};

const orderRelatedData = {
  exportHistory: [],
  fiscalYears: [],
  order: ORDER,
  orderInvoiceRelationships: [],
  orderLines: [],
  orderTemplate: {},
  refetchFiscalYears: jest.fn(),
  refetchOrder: jest.fn(),
  restrictions: {},
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter initialEntries={['/orders/view/73a9b376-844f-41b5-8b3f-71f2fae63f1f']}>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderComponent = (configProps = {}) => {
  return render(
    <Route
      path="/orders/view/:id"
      render={props => (
        <PO
          {...props}
          {...defaultProps}
          {...configProps}
        />
      )}
    />,
    { wrapper },
  );
};

describe('PO', () => {
  beforeEach(() => {
    usePurchaseOrderResources.mockReturnValue(orderRelatedData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render update encumbrance', async () => {
    renderComponent();
    await act(() => Promise.resolve());

    expect(await screen.findByTestId('update-encumbrances-button')).toBeInTheDocument();
  });

  it('should render custom fields accordion', () => {
    renderComponent();

    expect(screen.queryByText('ViewCustomFieldsRecord')).toBeInTheDocument();
  });
});

describe('PO actions', () => {
  const updateOrder = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    defaultProps.mutator.orderDetails.POST.mockClear();
    defaultProps.mutator.orderDetails.PUT.mockClear();
    history.push.mockClear();
    useOrderLinesAbandonedHoldingsCheck.mockClear();
    useOrderMutation.mockClear().mockReturnValue({ updateOrder });
  });

  describe('an open order', () => {
    it('should translate to receiving when receive button was clicked', async () => {
      renderComponent();

      const receiveBtn = await screen.findByTestId('order-receiving-button');

      await user.click(receiveBtn);

      expect(history.push).toHaveBeenCalled();
    });

    it('should translate to edit page when edit button was pressed', async () => {
      renderComponent();

      const editBtn = await screen.findByTestId('button-edit-order');

      await user.click(editBtn);

      expect(history.push).toHaveBeenCalled();
    });

    it('should close order after confirmation', async () => {
      renderComponent();

      const closeBtn = await screen.findByTestId('close-order-button');

      await user.click(closeBtn);

      const confirmCloseBtn = await screen.findByText('ui-orders.closeOrderModal.submit');
      const selectReason = await screen.findByLabelText('ui-orders.closeOrderModal.reason');

      await user.selectOptions(selectReason, 'reason');
      await user.click(confirmCloseBtn);

      expect(defaultProps.mutator.orderDetails.PUT).toHaveBeenCalled();
    });

    it('should cancel order after confirmation', async () => {
      renderComponent();

      const cancelBtn = await screen.findByTestId('cancel-order-button');

      await user.click(cancelBtn);

      const confirmCloseBtn = await screen.findByText('ui-orders.closeOrderModal.submit');

      await user.click(confirmCloseBtn);

      expect(defaultProps.mutator.orderDetails.PUT).toHaveBeenCalled();
    });

    it('should unopen order after confirmation', async () => {
      renderComponent();

      const unopenBtn = await screen.findByTestId('unopen-order-button');

      await user.click(unopenBtn);

      const confirmBtn = await screen.findByText('ui-orders.unopenOrderModal.confirmLabel');

      await user.click(confirmBtn);

      expect(updateOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          changedData: expect.objectContaining({
            workflowStatus: ORDER_STATUSES.pending,
          }),
        }),
      );
    });

    it('should update encumbrances when corresponding button was clicked', async () => {
      renderComponent();

      const updateEncumbBtn = await screen.findByTestId('update-encumbrances-button');

      await user.click(updateEncumbBtn);

      expect(defaultProps.mutator.updateEncumbrances.POST).toHaveBeenCalled();
    });

    it('should clone order after confirmation', async () => {
      renderComponent();

      const cloneBtn = await screen.findByTestId('clone-order-button');

      await user.click(cloneBtn);

      const confirmBtn = await screen.findByText('ui-orders.order.clone.confirmLabel');

      await user.click(confirmBtn);

      expect(defaultProps.mutator.generatedOrderNumber.GET).toHaveBeenCalled();
    });

    it('should delete order after confirmation', async () => {
      renderComponent();

      const deleteBtn = await screen.findByTestId('button-delete-order');

      await user.click(deleteBtn);

      const confirmBtn = await screen.findByText('ui-orders.order.delete.confirmLabel');

      await user.click(confirmBtn);

      expect(defaultProps.mutator.orderDetails.DELETE).toHaveBeenCalled();
    });

    it('should approve order', async () => {
      renderComponent({
        resources: {
          ...defaultProps.resources,
          approvalsSetting: {
            records: [{
              value: JSON.stringify({ isApprovalRequired: true }),
            }],
          },
        },
      });

      const approveBtn = await screen.findByTestId('approve-order-button');

      await user.click(approveBtn);

      expect(defaultProps.mutator.orderDetails.PUT).toHaveBeenCalled();
    });

    it('should update order details after reexport', async () => {
      renderComponent();

      const reexportBtn = await screen.findByTestId('reexport-order-button');

      await user.click(reexportBtn);

      const reexportConfirmBtn = await screen.findByTestId('confirm-reexport-button');

      await user.click(reexportConfirmBtn);

      expect(orderRelatedData.refetchOrder).toHaveBeenCalled();
    });
  });

  describe('a pending order', () => {
    it('should open order after confirmation', async () => {
      usePurchaseOrderResources.mockReturnValue({
        ...orderRelatedData,
        order: {
          ...ORDER,
          workflowStatus: ORDER_STATUSES.pending,
        },
      });

      renderComponent();

      const openBtn = await screen.findByTestId('open-order-button');

      await user.click(openBtn);

      const confirmBtn = await screen.findByText('ui-orders.openOrderModal.submit');

      await user.click(confirmBtn);

      expect(defaultProps.mutator.orderDetails.PUT).toHaveBeenCalled();
    });
  });

  describe('a closed order', () => {
    it('should reopen order', async () => {
      usePurchaseOrderResources.mockReturnValue({
        ...orderRelatedData,
        order: {
          ...ORDER,
          workflowStatus: ORDER_STATUSES.closed,
        },
      });

      renderComponent();

      const reopenBtn = await screen.findByTestId('reopen-order-button');

      await user.click(reopenBtn);

      expect(defaultProps.mutator.orderDetails.PUT).toHaveBeenCalled();
    });
  });

  describe('adding PO Line', () => {
    it('should create new POLine if the linelimit is not exceeded', async () => {
      usePurchaseOrderResources.mockReturnValue({
        ...orderRelatedData,
        order: {
          ...ORDER,
          workflowStatus: ORDER_STATUSES.pending,
        },
      });

      renderComponent();

      const addPOLineBtn = await screen.findByTestId('add-line-button');

      await act(async () => {
        await user.click(addPOLineBtn);
      });

      expect(history.push).toHaveBeenCalled();
    });

    it('should create new PO if the line limit is exceeded', async () => {
      usePurchaseOrderResources.mockReturnValue({
        ...orderRelatedData,
        order: {
          ...ORDER,
          workflowStatus: ORDER_STATUSES.pending,
        },
        orderLines: [{
          id: 'po-line-id',
          cost: {
            currency: 'USD',
          },
        }],
      });

      renderComponent();

      const addPOLineBtn = await screen.findByTestId('add-line-button');

      await act(async () => {
        await user.click(addPOLineBtn);
      });

      const createOrderBtn = await screen.findByText('ui-orders.linesLimit.createBtn');

      await act(async () => {
        await user.click(createOrderBtn);
      });

      expect(defaultProps.mutator.generatedOrderNumber.GET).toHaveBeenCalled();
    });
  });

  it('should close pane when close icon was clicked', async () => {
    renderComponent();

    await waitFor(async () => expect(await screen.findByText('ui-orders.order.paneTitle.details')).toBeInTheDocument());

    const closeBtn = await screen.findByRole('button', { name: 'stripes-components.closeItem' });

    await user.click(closeBtn);

    expect(history.push).toHaveBeenCalled();
  });

  it('should open PO version history pane', async () => {
    renderComponent();

    const openPaneBtn = await screen.findByRole('button', { name: 'stripes-acq-components.versionHistory.pane.header' });

    await act(async () => user.click(openPaneBtn));

    expect(defaultProps.history.push).toHaveBeenCalledWith(expect.objectContaining({
      pathname: `${ORDERS_ROUTE}/view/${ORDER.id}/versions`,
    }));
  });
});

describe('PO errors', () => {
  it('should handle errors on update order', async () => {
    defaultProps.mutator.orderDetails.PUT.mockRejectedValue({});

    usePurchaseOrderResources.mockReturnValue({
      ...orderRelatedData,
      order: {
        ...ORDER,
        workflowStatus: ORDER_STATUSES.pending,
        approved: true,
      },
    });

    renderComponent();

    const openOrderBtn = await screen.findByTestId('open-order-button');

    await user.click(openOrderBtn);

    await waitFor(() => {
      expect(screen.getByText('ui-orders.openOrderModal.submit')).toBeInTheDocument();
    });

    await user.click(screen.getByText('ui-orders.openOrderModal.submit'));

    await waitFor(() => {
      expect(defaultProps.mutator.orderDetails.PUT).toHaveBeenCalled();
    });
  });
});

describe('PO shortcuts', () => {
  beforeEach(() => {
    HasCommand.mockClear();
  });

  it('should expand all sections', async () => {
    renderComponent();

    await waitFor(() => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler());

    expect(expandAllSections).toHaveBeenCalled();
  });

  it('should collapse all sections', async () => {
    renderComponent();

    await waitFor(() => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler());

    expect(collapseAllSections).toHaveBeenCalled();
  });

  it('should translate to order creation', async () => {
    renderComponent();

    await waitFor(() => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler());

    expect(history.push).toHaveBeenCalled();
  });

  it('should translate to order edit page', async () => {
    renderComponent();

    await waitFor(() => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler());

    expect(history.push).toHaveBeenCalled();
  });

  it('should open duplication confirmation modal', async () => {
    renderComponent();

    await waitFor(() => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'duplicateRecord').handler());

    expect(screen.getByText('ui-orders.order.clone.message')).toBeInTheDocument();
  });

  it('should translate to POL creation form', async () => {
    usePurchaseOrderResources.mockReturnValue({
      ...orderRelatedData,
      order: {
        ...ORDER,
        workflowStatus: ORDER_STATUSES.pending,
      },
    });

    renderComponent();

    await waitFor(() => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'addPOL').handler());

    expect(history.push).toHaveBeenCalledWith({
      pathname: `/orders/view/${ORDER.id}/po-line/create`,
      search: '',
    });
  });
});
