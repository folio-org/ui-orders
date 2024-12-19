import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, Icon, MenuSection } from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import { ReexportActionButton } from '../../../common';

import {
  isCheckInAvailableForLine,
  isReceiveAvailableForLine,
  isWorkflowStatusClosed,
  isWorkflowStatusOpen,
} from '../../PurchaseOrder/util';

export const POLineActionMenu = ({
  hiddenFields,
  line,
  order,
  orderTemplate,
  restrictions,
  isEditable,
  isCancelable,
  isRestrictionsLoading,
  onCancelLine,
  onChangeInstance,
  onDeleteLine,
  onEditLine,
  onNavigateToOrder,
  onReceive,
  onPrintLine,
  onPrintOrder,
  onReexport,
  onToggle,
  toggleForceVisibility,
}) => {
  const isReceiveButtonVisible = isReceiveAvailableForLine(line, order);
  const isCheckInButtonVisible = isCheckInAvailableForLine(line, order);
  const isChangeInstanceVisible = isWorkflowStatusClosed(order) || isWorkflowStatusOpen(order);
  const isOrderLineReexportDisabled = !(
    isWorkflowStatusOpen(order) && line.lastEDIExportDate && line.automaticExport
  );

  const onClickEdit = useCallback(() => {
    onToggle();
    onEditLine();
  }, [onEditLine, onToggle]);

  const onClickChangeInstance = useCallback(() => {
    onToggle();
    onChangeInstance();
  }, [onChangeInstance, onToggle]);

  const onClickViewPo = useCallback(() => {
    onToggle();
    onNavigateToOrder();
  }, [onNavigateToOrder, onToggle]);

  const onClickReceive = useCallback(() => {
    onToggle();
    Promise.resolve().then(() => onReceive());
  }, [onReceive, onToggle]);

  const onClickReexport = useCallback(() => {
    onToggle();
    onReexport();
  }, [onReexport, onToggle]);

  const onClickCancel = useCallback(() => {
    onToggle();
    onCancelLine();
  }, [onCancelLine, onToggle]);

  const onClickDelete = useCallback(() => {
    onToggle();
    onDeleteLine();
  }, [onDeleteLine, onToggle]);

  const onClickPrintLine = useCallback(() => {
    onToggle();
    onPrintLine();
  }, [onPrintLine, onToggle]);

  const onClickPrintOrder = useCallback(() => {
    onToggle();
    onPrintOrder();
  }, [onPrintOrder, onToggle]);

  const onToggleForceVisibility = useCallback(() => {
    onToggle();
    toggleForceVisibility();
  }, [onToggle, toggleForceVisibility]);

  return (
    <MenuSection id="data-test-line-details-actions">
      {isEditable && (
        <IfPermission perm="orders.po-lines.item.put">
          <Button
            data-testid="edit-line-action"
            buttonStyle="dropdownItem"
            data-test-button-edit-line
            disabled={isRestrictionsLoading || restrictions.protectUpdate}
            onClick={onClickEdit}
          >
            <Icon size="small" icon="edit">
              <FormattedMessage id="ui-orders.button.edit" />
            </Icon>
          </Button>

          {isChangeInstanceVisible && (
            <Button
              buttonStyle="dropdownItem"
              id="change-instance-connection-action"
              data-testid="line-details-actions-change-instance"
              disabled={isRestrictionsLoading || restrictions.protectUpdate}
              onClick={onClickChangeInstance}
            >
              <Icon size="small" icon="edit">
                <FormattedMessage id="ui-orders.buttons.line.changeInstance" />
              </Icon>
            </Button>
          )}
        </IfPermission>
      )}

      {onNavigateToOrder && (
        <Button
          data-test-line-details-actions-view-po
          data-testid="line-details-actions-view-po"
          buttonStyle="dropdownItem"
          onClick={onClickViewPo}
        >
          <Icon icon="eye-open">
            <FormattedMessage id="ui-orders.poLine.actions.viewPO" />
          </Icon>
        </Button>
      )}

      <IfPermission perm="ui-receiving.view">
        {(isReceiveButtonVisible || isCheckInButtonVisible) && (
          <Button
            data-testid="line-details-receive-action"
            buttonStyle="dropdownItem"
            data-test-line-receive-button
            onClick={onClickReceive}
          >
            <Icon size="small" icon="receive">
              <FormattedMessage id="ui-orders.paneBlock.receiveBtn" />
            </Icon>
          </Button>
        )}
      </IfPermission>

      <ReexportActionButton
        id="reexport-order-line-button"
        disabled={isOrderLineReexportDisabled}
        onClick={onClickReexport}
      />

      {isCancelable && (
        <IfPermission perm="ui-orders.order-lines.cancel">
          <Button
            buttonStyle="dropdownItem"
            data-testid="cancel-line-button"
            disabled={isRestrictionsLoading || restrictions.protectUpdate}
            onClick={onClickCancel}
          >
            <Icon size="small" icon="cancel">
              <FormattedMessage id="ui-orders.buttons.line.cancel" />
            </Icon>
          </Button>
        </IfPermission>
      )}

      <IfPermission perm="orders.po-lines.item.delete">
        <Button
          buttonStyle="dropdownItem"
          data-test-button-delete-line
          data-testid="button-delete-line"
          disabled={isRestrictionsLoading || restrictions.protectDelete}
          onClick={onClickDelete}
        >
          <Icon size="small" icon="trash">
            <FormattedMessage id="ui-orders.button.delete" />
          </Icon>
        </Button>
      </IfPermission>

      <Button
        data-testid="line-details-print-line-action"
        buttonStyle="dropdownItem"
        onClick={onClickPrintLine}
      >
        <Icon size="small" icon="print">
          <FormattedMessage id="ui-orders.button.printLine" />
        </Icon>
      </Button>

      <Button
        data-testid="line-details-print-order-action"
        buttonStyle="dropdownItem"
        onClick={onClickPrintOrder}
      >
        <Icon size="small" icon="print">
          <FormattedMessage id="ui-orders.button.printOrder" />
        </Icon>
      </Button>

      {Boolean(orderTemplate.hiddenFields) && (
        <IfPermission perm="ui-orders.order.showHidden">
          <Button
            id="line-clickable-show-hidden"
            data-testid="line-toggle-key-values-visibility"
            buttonStyle="dropdownItem"
            onClick={onToggleForceVisibility}
          >
            <Icon size="small" icon={`eye-${hiddenFields ? 'open' : 'closed'}`}>
              <FormattedMessage id={`ui-orders.order.${hiddenFields ? 'showHidden' : 'hideFields'}`} />
            </Icon>
          </Button>
        </IfPermission>
      )}
    </MenuSection>
  );
};

POLineActionMenu.propTypes = {
  hiddenFields: PropTypes.object.isRequired,
  isCancelable: PropTypes.bool,
  isEditable: PropTypes.bool,
  isRestrictionsLoading: PropTypes.bool,
  line: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  orderTemplate: PropTypes.object.isRequired,
  onCancelLine: PropTypes.func.isRequired,
  onChangeInstance: PropTypes.func.isRequired,
  onDeleteLine: PropTypes.func.isRequired,
  onEditLine: PropTypes.func.isRequired,
  onNavigateToOrder: PropTypes.func,
  onReceive: PropTypes.func,
  onPrintLine: PropTypes.func.isRequired,
  onPrintOrder: PropTypes.func.isRequired,
  onReexport: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  restrictions: PropTypes.object.isRequired,
  toggleForceVisibility: PropTypes.func.isRequired,
};
