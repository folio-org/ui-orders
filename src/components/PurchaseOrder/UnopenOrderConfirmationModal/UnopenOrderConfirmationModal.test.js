import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';

import { order } from '../../../../test/jest/fixtures';
import { UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES } from '../../../common/constants';
import { useOrderLinesAbandonedHoldingsCheck } from '../../../common/hooks';
import { UnopenOrderConfirmationModal } from './UnopenOrderConfirmationModal';

jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useOrderLinesAbandonedHoldingsCheck: jest.fn(() => ({ isFetching: false, result: { type: 'withoutPieces' } })),
}));

const defaultProps = {
  compositeOrder: order,
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
};

const renderUnopenOrderConfirmationModal = (props = {}) => render(
  <UnopenOrderConfirmationModal
    {...defaultProps}
    {...props}
  />,
);

describe('UnopenOrderConfirmationModal', () => {
  it('should render unopen order confirmation modal ', () => {
    renderUnopenOrderConfirmationModal();

    expect(screen.getByText('ui-orders.unopenOrderModal.title')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.unopenOrderModal.message.withoutPieces')).toBeInTheDocument();
  });
});

describe('UnopenOrderConfirmationModal actions', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onConfirm.mockClear();
    useOrderLinesAbandonedHoldingsCheck.mockClear();
  });

  it('should close modal', async () => {
    renderUnopenOrderConfirmationModal();

    const cancelBtn = await screen.findByText('stripes-components.cancel');

    await act(async () => user.click(cancelBtn));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should confirm unopen order', async () => {
    renderUnopenOrderConfirmationModal();

    const confirmBtn = await screen.findByText('ui-orders.unopenOrderModal.confirmLabel');

    await act(async () => user.click(confirmBtn));

    expect(defaultProps.onConfirm).toHaveBeenCalledWith({ deleteHoldings: false });
  });

  describe('Abandoned holdings after unopen order', () => {
    describe('connected to at least one \'synchronized\' PO Line', () => {
      beforeEach(() => {
        useOrderLinesAbandonedHoldingsCheck.mockReturnValue({
          isFetching: false,
          result: { type: UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.synchronized },
        });
      });

      it('should render message about abandoned holding(s) connected to a synchronized line(s)', () => {
        renderUnopenOrderConfirmationModal();

        expect(screen.getByText('ui-orders.unopenOrderModal.message.synchronized')).toBeInTheDocument();
      });

      it('should confirm unopend order with \'deleteHoldings\' flag equal \'true\'', async () => {
        renderUnopenOrderConfirmationModal();

        const confirmBtn = await screen.findByText('ui-orders.unopenOrderModal.confirmLabel.deleteHoldings.synchronized');

        await act(async () => user.click(confirmBtn));

        expect(defaultProps.onConfirm).toHaveBeenCalledWith({ deleteHoldings: true });
      });

      it('should confirm unopend order with \'deleteHoldings\' flag equal \'false\'', async () => {
        renderUnopenOrderConfirmationModal();

        const confirmBtn = await screen.findByText('ui-orders.unopenOrderModal.confirmLabel.keepHoldings.synchronized');

        await act(async () => user.click(confirmBtn));

        expect(defaultProps.onConfirm).toHaveBeenCalledWith({ deleteHoldings: false });
      });
    });

    describe('connected to at least one \'independent\' PO Line and not to \'synchronized\'', () => {
      beforeEach(() => {
        useOrderLinesAbandonedHoldingsCheck.mockReturnValue({
          isFetching: false,
          result: { type: UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES.independent },
        });
      });

      it('should render message about abandoned holding(s) connected to a independent line(s)', () => {
        renderUnopenOrderConfirmationModal();

        expect(screen.getByText('ui-orders.unopenOrderModal.message.independent')).toBeInTheDocument();
      });

      it('should confirm unopend order with \'deleteHoldings\' flag equal \'true\'', async () => {
        renderUnopenOrderConfirmationModal();

        const confirmBtn = await screen.findByText('ui-orders.unopenOrderModal.confirmLabel.deleteHoldings.independent');

        await act(async () => user.click(confirmBtn));

        expect(defaultProps.onConfirm).toHaveBeenCalledWith({ deleteHoldings: true });
      });

      it('should confirm unopend order with \'deleteHoldings\' flag equal \'false\'', async () => {
        renderUnopenOrderConfirmationModal();

        const confirmBtn = await screen.findByText('ui-orders.unopenOrderModal.confirmLabel.keepHoldings.independent');

        await act(async () => user.click(confirmBtn));

        expect(defaultProps.onConfirm).toHaveBeenCalledWith({ deleteHoldings: false });
      });
    });
  });
});
