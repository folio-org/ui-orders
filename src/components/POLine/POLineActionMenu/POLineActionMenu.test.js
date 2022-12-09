import user from '@testing-library/user-event';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { order, orderLine } from '../../../../test/jest/fixtures';
import { WORKFLOW_STATUS } from '../../../common/constants';
import { POLineActionMenu } from './POLineActionMenu';

const defaultProps = {
  hiddenFields: {},
  isCancelable: true,
  isEditable: true,
  isRestrictionsLoading: false,
  line: orderLine,
  order,
  orderTemplate: {},
  onCancelLine: jest.fn(),
  onChangeInstance: jest.fn(),
  onDeleteLine: jest.fn(),
  onEditLine: jest.fn(),
  onPrintLine: jest.fn(),
  onPrintOrder: jest.fn(),
  onReexport: jest.fn(),
  onToggle: jest.fn(),
  restrictions: {},
  toggleForceVisibility: jest.fn(),
};

const renderPOLineActionMenu = (props = {}) => render(
  <POLineActionMenu
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('POLineActionMenu', () => {
  describe('action handlers', () => {
    beforeEach(() => {
      defaultProps.onCancelLine.mockClear();
      defaultProps.onChangeInstance.mockClear();
      defaultProps.onDeleteLine.mockClear();
      defaultProps.onEditLine.mockClear();
      defaultProps.onPrintLine.mockClear();
      defaultProps.onPrintOrder.mockClear();
      defaultProps.onReexport.mockClear();
      defaultProps.onToggle.mockClear();
      defaultProps.toggleForceVisibility.mockClear();
    });

    it('should call \'onEditLine\' when \'Edit\' action was triggered', async () => {
      renderPOLineActionMenu();

      await act(async () => user.click(screen.getByTestId('edit-line-action')));

      expect(defaultProps.onEditLine).toHaveBeenCalled();
    });

    it('should call \'onOpenOrder\' when \'View PO\' action was triggered', async () => {
      const onNavigateToOrder = jest.fn();

      renderPOLineActionMenu({ onNavigateToOrder });

      await act(async () => user.click(screen.getByTestId('line-details-actions-view-po')));

      expect(onNavigateToOrder).toHaveBeenCalled();
    });

    it('should call \'onChangeInstance\' when \'Change instance connection\' action was triggered', async () => {
      renderPOLineActionMenu({ order: { ...order, workflowStatus: WORKFLOW_STATUS.open } });

      await act(async () => user.click(screen.getByTestId('line-details-actions-change-instance')));

      expect(defaultProps.onChangeInstance).toHaveBeenCalled();
    });

    it('should call \'onReexport\' when \'Re-export\' action was triggered', async () => {
      renderPOLineActionMenu({
        order: {
          ...order,
          workflowStatus: WORKFLOW_STATUS.open,
        },
        line: {
          ...orderLine,
          lastEDIExportDate: '202-12-08T00:00:00.000+00:00',
          automaticExport: true,
        },
      });

      await act(async () => user.click(screen.getByTestId('reexport-order-line-button')));

      expect(defaultProps.onReexport).toHaveBeenCalled();
    });

    it('should call \'onCancelLine\' when \'Cancel\' action was triggered', async () => {
      renderPOLineActionMenu();

      await act(async () => user.click(screen.getByTestId('cancel-line-button')));

      expect(defaultProps.onCancelLine).toHaveBeenCalled();
    });

    it('should call \'onDeleteLine\' when \'Delete\' action was triggered', async () => {
      renderPOLineActionMenu();

      await act(async () => user.click(screen.getByTestId('button-delete-line')));

      expect(defaultProps.onDeleteLine).toHaveBeenCalled();
    });

    it('should call \'onPrintLine\' when \'Print order line\' action was triggered', async () => {
      renderPOLineActionMenu();

      await act(async () => user.click(screen.getByTestId('line-details-print-line-action')));

      expect(defaultProps.onPrintLine).toHaveBeenCalled();
    });

    it('should call \'onPrintOrder\' when \'Print order\' action was triggered', async () => {
      renderPOLineActionMenu();

      await act(async () => user.click(screen.getByTestId('line-details-print-order-action')));

      expect(defaultProps.onPrintOrder).toHaveBeenCalled();
    });

    it('should call \'toggleForceVisibility\' when \'Show hidden fields\' action was triggered', async () => {
      renderPOLineActionMenu({
        orderTemplate: {
          hiddenFields: { isPackage: true },
        },
      });

      await act(async () => user.click(screen.getByTestId('line-toggle-key-values-visibility')));

      expect(defaultProps.toggleForceVisibility).toHaveBeenCalled();
    });
  });
});
