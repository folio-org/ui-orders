/* eslint-disable react/prop-types */
import React from 'react';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import { getConfigSetting } from '@folio/stripes-acq-components';

import {
  isOpenAvailableForOrder,
  isReceiveAvailableForOrder,
  isWorkflowStatusClosed,
  isWorkflowStatusOpen,
} from './util';

export function getPOActionMenu({
  approvalsSetting,
  clickApprove,
  clickCancel,
  clickClone,
  clickClose,
  clickCreateInvoice,
  clickDelete,
  clickEdit,
  clickOpen,
  clickReceive,
  clickReopen,
  clickUnopen,
  clickUpdateEncumbrances,
  handlePrint,
  isRestrictionsLoading,
  order,
  restrictions,
  toggleForceVisibility,
  hiddenFields,
  orderTemplate,
}) {
  const { isApprovalRequired } = getConfigSetting(approvalsSetting);
  const isApproved = get(order, 'approved');
  const isOpenOrderButtonVisible = isOpenAvailableForOrder(isApprovalRequired, order);
  const isApproveOrderButtonVisible = isApprovalRequired && !isApproved;
  const isReceiveButtonVisible = isReceiveAvailableForOrder(order);
  const isReopenButtonVisible = isWorkflowStatusClosed(order);
  const isOrderInOpenStatus = isWorkflowStatusOpen(order);
  const isUpdateDisabled = isRestrictionsLoading || restrictions.protectUpdate;

  return ({ onToggle }) => (
    <MenuSection id="order-details-actions">
      <IfPermission perm="orders.item.put">
        <Button
          buttonStyle="dropdownItem"
          data-test-button-edit-order
          data-testid="button-edit-order"
          disabled={isUpdateDisabled}
          onClick={() => {
            onToggle();
            clickEdit();
          }}
        >
          <Icon size="small" icon="edit">
            <FormattedMessage id="ui-orders.button.edit" />
          </Icon>
        </Button>
      </IfPermission>
      <IfPermission perm="orders.item.put">
        <IfPermission perm="orders.item.approve">
          {isApproveOrderButtonVisible && (
            <Button
              buttonStyle="dropdownItem"
              data-test-approve-order-button
              data-testid="approve-order-button"
              disabled={isUpdateDisabled}
              onClick={clickApprove}
            >
              <FormattedMessage id="ui-orders.paneBlock.approveBtn" />
            </Button>
          )}
        </IfPermission>
        {isOrderInOpenStatus && (
          <Button
            buttonStyle="dropdownItem"
            data-test-close-order-button
            data-testid="close-order-button"
            disabled={isUpdateDisabled}
            onClick={clickClose}
          >
            <Icon size="small" icon="archive">
              <FormattedMessage id="ui-orders.paneBlock.closeBtn" />
            </Icon>
          </Button>
        )}
        {isOpenOrderButtonVisible && (
          <Button
            buttonStyle="dropdownItem"
            data-test-open-order-button
            data-testid="open-order-button"
            disabled={isUpdateDisabled}
            onClick={clickOpen}
          >
            <Icon size="small" icon="cart">
              <FormattedMessage id="ui-orders.paneBlock.openBtn" />
            </Icon>
          </Button>
        )}
        <IfPermission perm="ui-orders.order.cancel">
          {isOrderInOpenStatus && (
            <Button
              buttonStyle="dropdownItem"
              data-testid="cancel-order-button"
              disabled={isUpdateDisabled}
              onClick={clickCancel}
            >
              <Icon size="small" icon="cancel">
                <FormattedMessage id="ui-orders.buttons.line.cancel" />
              </Icon>
            </Button>
          )}
        </IfPermission>
        <IfPermission perm="orders.item.unopen">
          {isOrderInOpenStatus && (
            <Button
              buttonStyle="dropdownItem"
              data-test-unopen-order-button
              disabled={isUpdateDisabled}
              onClick={clickUnopen}
            >
              <FormattedMessage id="ui-orders.paneBlock.unopenBtn" />
            </Button>
          )}
        </IfPermission>
      </IfPermission>
      <IfPermission perm="ui-receiving.view">
        {isReceiveButtonVisible && (
          <Button
            buttonStyle="dropdownItem"
            data-test-receiving-button
            data-testid="order-receiving-button"
            onClick={clickReceive}
          >
            <Icon size="small" icon="receive">
              <FormattedMessage id="ui-orders.paneBlock.receiveBtn" />
            </Icon>
          </Button>
        )}
      </IfPermission>
      <IfPermission perm="ui-orders.order.updateEncumbrances">
        {isOrderInOpenStatus && (
          <Button
            buttonStyle="dropdownItem"
            onClick={clickUpdateEncumbrances}
          >
            <FormattedMessage id="ui-orders.paneBlock.updateEncumbrances" />
          </Button>
        )}
      </IfPermission>
      <IfPermission perm="ui-orders.createInvoice">
        <Button
          buttonStyle="dropdownItem"
          onClick={clickCreateInvoice}
        >
          <Icon size="small" icon="plus-sign">
            <FormattedMessage id="ui-orders.paneBlock.createInvoice" />
          </Icon>
        </Button>
      </IfPermission>
      <IfPermission perm="orders.item.post">
        <Button
          buttonStyle="dropdownItem"
          data-test-clone-order-button
          data-testid="clone-order-button"
          onClick={clickClone}
        >
          <Icon size="small" icon="duplicate">
            <FormattedMessage id="ui-orders.paneBlock.cloneBtn" />
          </Icon>
        </Button>
      </IfPermission>
      {isReopenButtonVisible && (
        <Button
          buttonStyle="dropdownItem"
          data-test-reopen-order-button
          data-testid="reopen-order-button"
          disabled={isUpdateDisabled}
          onClick={() => {
            onToggle();
            clickReopen();
          }}
        >
          <FormattedMessage id="ui-orders.paneBlock.reopenBtn" />
        </Button>
      )}
      <IfPermission perm="orders.item.delete">
        <Button
          buttonStyle="dropdownItem"
          data-test-button-delete-order
          data-testid="button-delete-order"
          disabled={isRestrictionsLoading || restrictions.protectDelete}
          onClick={clickDelete}
        >
          <Icon size="small" icon="trash">
            <FormattedMessage id="ui-orders.button.delete" />
          </Icon>
        </Button>
      </IfPermission>
      <Button
        buttonStyle="dropdownItem"
        data-testid="button-print-order"
        onClick={() => {
          onToggle();
          handlePrint();
        }}
      >
        <Icon size="small" icon="print">
          <FormattedMessage id="ui-orders.button.printOrder" />
        </Icon>
      </Button>
      {Boolean(orderTemplate.hiddenFields) && (
        <IfPermission perm="ui-orders.order.showHidden">
          <Button
            id="order-clickable-show-hidden"
            data-testid="order-toggle-key-values-visibility"
            buttonStyle="dropdownItem"
            onClick={() => {
              toggleForceVisibility();
              onToggle();
            }}
          >
            <Icon size="small" icon={`eye-${hiddenFields ? 'open' : 'closed'}`}>
              <FormattedMessage id={`ui-orders.order.${hiddenFields ? 'showHidden' : 'hideFields'}`} />
            </Icon>
          </Button>
        </IfPermission>
      )}
    </MenuSection>
  );
}
