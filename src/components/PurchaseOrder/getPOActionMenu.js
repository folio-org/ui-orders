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

import { WORKFLOW_STATUS } from '../../common/constants';
import {
  isOpenAvailableForOrder,
  isReceiveAvailableForOrder,
  isWorkflowStatusClosed,
} from './util';

export function getPOActionMenu({
  approvalsSetting,
  clickApprove,
  clickClone,
  clickClose,
  clickDelete,
  clickEdit,
  clickOpen,
  clickReceive,
  clickReopen,
  order,
}) {
  const { isApprovalRequired } = getConfigSetting(approvalsSetting);
  const isApproved = get(order, 'approved');
  const workflowStatus = get(order, 'workflowStatus');
  const isCloseOrderButtonVisible = workflowStatus === WORKFLOW_STATUS.open;
  const isOpenOrderButtonVisible = isOpenAvailableForOrder(isApprovalRequired, order);
  const isApproveOrderButtonVisible = isApprovalRequired && !isApproved;
  const isReceiveButtonVisible = isReceiveAvailableForOrder(order);
  const isReopenButtonVisible = isWorkflowStatusClosed(order);

  return ({ onToggle }) => (
    <MenuSection id="order-details-actions">
      <IfPermission perm="orders.item.delete">
        <Button
          buttonStyle="dropdownItem"
          data-test-button-delete-order
          onClick={clickDelete}
        >
          <Icon size="small" icon="trash">
            <FormattedMessage id="ui-orders.button.delete" />
          </Icon>
        </Button>
      </IfPermission>
      <IfPermission perm="orders.item.put">
        <Button
          buttonStyle="dropdownItem"
          data-test-button-edit-order
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
              onClick={clickApprove}
            >
              <FormattedMessage id="ui-orders.paneBlock.approveBtn" />
            </Button>
          )}
        </IfPermission>
        {isCloseOrderButtonVisible && (
          <Button
            buttonStyle="dropdownItem"
            data-test-close-order-button
            onClick={clickClose}
          >
            <FormattedMessage id="ui-orders.paneBlock.closeBtn" />
          </Button>
        )}
        {isOpenOrderButtonVisible && (
          <Button
            buttonStyle="dropdownItem"
            data-test-open-order-button
            onClick={clickOpen}
          >
            <FormattedMessage id="ui-orders.paneBlock.openBtn" />
          </Button>
        )}
      </IfPermission>
      <IfPermission perm="orders.receiving.collection.post">
        {isReceiveButtonVisible && (
          <Button
            buttonStyle="dropdownItem"
            data-test-receiving-button
            onClick={clickReceive}
          >
            <FormattedMessage id="ui-orders.paneBlock.receiveBtn" />
          </Button>
        )}
      </IfPermission>
      <IfPermission perm="orders.item.post">
        <Button
          buttonStyle="dropdownItem"
          data-test-clone-order-button
          onClick={clickClone}
        >
          <FormattedMessage id="ui-orders.paneBlock.cloneBtn" />
        </Button>
      </IfPermission>
      {isReopenButtonVisible && (
        <Button
          buttonStyle="dropdownItem"
          data-test-reopen-order-button
          onClick={() => {
            onToggle();
            clickReopen();
          }}
        >
          <FormattedMessage id="ui-orders.paneBlock.reopenBtn" />
        </Button>
      )}
    </MenuSection>
  );
}
