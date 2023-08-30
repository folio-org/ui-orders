import { BrowserRouter, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { act, render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';
import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { history } from 'fixtures/routerMocks';
import { ORDERS_ROUTE } from '../../common/constants';
import { useOrderLinesAbandonedHoldingsCheck } from '../../common/hooks';
import { useOrderMutation } from './hooks';
import PO from './PO';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/hooks/useAcqRestrictions', () => {
  return {
    useAcqRestrictions: jest.fn().mockReturnValue({ restrictions: {} }),
  };
});
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useOrderLinesAbandonedHoldingsCheck: jest.fn(() => ({ isFetching: false, result: { type: 'withoutPieces' } })),
}));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useOrderMutation: jest.fn(() => ({ updateOrder: jest.fn(() => Promise.resolve()) })),
}));

const ORDER = {
  id: '73a9b376-844f-41b5-8b3f-71f2fae63f1f',
  workflowStatus: ORDER_STATUSES.open,
  compositePoLines: [{
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
      GET: jest.fn().mockResolvedValue(ORDER),
      POST: jest.fn().mockResolvedValue(ORDER),
      PUT: jest.fn().mockResolvedValue(ORDER),
      DELETE: jest.fn().mockResolvedValue(ORDER),
    },
    orderInvoicesRelns: {
      GET: jest.fn().mockResolvedValue([]),
    },
    orderLines: {
      GET: jest.fn().mockResolvedValue([]),
    },
    orderDetailsList: {
      GET: jest.fn().mockResolvedValue([ORDER, [{ invoiceId: 'invoiceId' }]]),
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

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </QueryClientProvider>
);

const renderComponent = (configProps = {}) => {
  window.history.pushState({}, 'Test page', '/orders/view/73a9b376-844f-41b5-8b3f-71f2fae63f1f');

  return render(
    <IntlProvider locale="en">
      <Route
        path="/orders/view/:id"
        render={props => (
          <PO
            {...props}
            {...defaultProps}
            {...configProps}
          />
        )}
      />
    </IntlProvider>,
    { wrapper },
  );
};

describe('PO', () => {
  it('should render update encumbrance', async () => {
    renderComponent();
    await act(() => Promise.resolve());

    expect(screen.findByTestId('update-encumbrances-button')).toBeDefined();
  });
});

describe('PO actions', () => {
  const updateOrder = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    defaultProps.mutator.orderDetails.GET.mockClear();
    defaultProps.mutator.orderDetails.POST.mockClear();
    defaultProps.mutator.orderDetails.PUT.mockClear();
    defaultProps.mutator.orderDetailsList.GET.mockClear();
    defaultProps.mutator.orderInvoicesRelns.GET.mockClear();
    defaultProps.mutator.orderLines.GET.mockClear();
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

      await act(async () => await user.click(unopenBtn));

      const confirmBtn = await screen.findByText('ui-orders.unopenOrderModal.confirmLabel');

      await act(async () => await user.click(confirmBtn));

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

    it('should update order details after re-export', async () => {
      renderComponent();

      const reexportBtn = await screen.findByTestId('reexport-order-button');

      await act(async () => user.click(reexportBtn));

      const reexportConfirmBtn = await screen.findByTestId('confirm-reexport-button');

      await act(async () => user.click(reexportConfirmBtn));

      expect(defaultProps.mutator.orderDetails.GET).toHaveBeenCalled();
    });
  });

  describe('a pending order', () => {
    it('should open order after confirmation', async () => {
      defaultProps.mutator.orderDetails.GET.mockResolvedValue({
        ...ORDER,
        workflowStatus: ORDER_STATUSES.pending,
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
      defaultProps.mutator.orderDetails.GET.mockResolvedValue({
        ...ORDER,
        workflowStatus: ORDER_STATUSES.closed,
      });

      renderComponent();

      const reopenBtn = await screen.findByTestId('reopen-order-button');

      await user.click(reopenBtn);

      expect(defaultProps.mutator.orderDetails.PUT).toHaveBeenCalled();
    });
  });

  describe('adding PO Line', () => {
    it('should create new POLine if the linelimit is not exceeded', async () => {
      defaultProps.mutator.orderDetails.GET.mockResolvedValue({
        ...ORDER,
        workflowStatus: ORDER_STATUSES.pending,
        compositePoLines: [],
      });

      renderComponent();

      const addPOLineBtn = await screen.findByTestId('add-line-button');

      await user.click(addPOLineBtn);

      expect(history.push).toHaveBeenCalled();
    });

    it('should create new PO if the linelimit is exceeded', async () => {
      defaultProps.mutator.orderDetails.GET.mockResolvedValue({
        ...ORDER,
        workflowStatus: ORDER_STATUSES.pending,
      });

      renderComponent();

      const addPOLineBtn = await screen.findByTestId('add-line-button');

      await user.click(addPOLineBtn);

      const createOrderBtn = await screen.findByText('ui-orders.linesLimit.createBtn');

      await user.click(createOrderBtn);

      expect(defaultProps.mutator.generatedOrderNumber.GET).toHaveBeenCalled();
    });
  });

  it('should close pane when close icon was clicked', async () => {
    renderComponent();

    await user.click(screen.getByRole('button'));

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
  it('should handle errors on fetch data', async () => {
    defaultProps.mutator.orderDetails.GET.mockRejectedValue({
      message: [],
    });
    defaultProps.mutator.orderInvoicesRelns.GET.mockRejectedValue();
    defaultProps.mutator.orderLines.GET.mockRejectedValue();

    renderComponent();

    await waitFor(() => {
      expect(defaultProps.mutator.orderDetails.GET).toHaveBeenCalled();
      expect(defaultProps.mutator.orderInvoicesRelns.GET).toHaveBeenCalled();
      expect(defaultProps.mutator.orderLines.GET).toHaveBeenCalled();
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
    defaultProps.mutator.orderDetails.GET.mockResolvedValue({
      ...ORDER,
      workflowStatus: ORDER_STATUSES.pending,
      compositePoLines: [],
    });

    renderComponent();

    await waitFor(() => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'addPOL').handler());

    expect(history.push).toHaveBeenCalledWith({
      pathname: `/orders/view/${ORDER.id}/po-line/create`,
      search: '',
    });
  });
});
