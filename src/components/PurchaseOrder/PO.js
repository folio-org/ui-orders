import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { get } from 'lodash';

import {
  IfPermission,
  stripesConnect,
} from '@folio/stripes/core';
import {
  Tags,
  TagsBadge,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  ConfirmationModal,
  ExpandAllButton,
  LoadingPane,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import {
  getAddresses,
} from '../../common/utils';
import { isOngoing } from '../../common/POFields';
import { WORKFLOW_STATUS } from '../../common/constants';
import { reasonsForClosureResource } from '../../common/resources';
import {
  ADDRESSES,
  APPROVALS_SETTING,
  FUND,
  LINES_LIMIT,
  ORDER,
} from '../Utils/resources';
import {
  cloneOrder,
  updateOrderResource,
} from '../Utils/orderResource';
import { showUpdateOrderError } from '../Utils/order';
import { LINES_LIMIT_DEFAULT } from '../Utils/const';
import CloseOrderModal from './CloseOrder';
import OpenOrderConfirmationModal from './OpenOrderConfirmationModal';
import LineListing from './LineListing';
import { PODetailsView } from './PODetails';
import { SummaryView } from './Summary';
import { OngoingOrderInfoView } from './OngoingOgderInfo';
import LinesLimit from './LinesLimit';
import POInvoicesContainer from './POInvoices';
import { UpdateOrderErrorModal } from './UpdateOrderErrorModal';
import { getPOActionMenu } from './getPOActionMenu';

const PO = ({
  history,
  location,
  match,
  mutator,
  resources,
}) => {
  const sendCallout = useShowCallout();

  // this is required to avoid huge refactoring of processing error messages for now
  const context = useMemo(() => ({ sendCallout }), [sendCallout]);
  const [order, setOrder] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [updateOrderErrors, setUpdateOrderErrors] = useState(null);
  const orderErrorModalShow = useCallback(setUpdateOrderErrors, [setUpdateOrderErrors]);

  const fetchOrder = useCallback(
    () => mutator.orderDetails.GET()
      .then(setOrder)
      .catch(() => {
        sendCallout({
          message: <SafeHTMLMessage id="ui-orders.errors.orderNotLoaded" />,
          type: 'error',
        });
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [match.params.id, sendCallout],
  );

  useEffect(
    () => {
      setIsLoading(true);
      fetchOrder().finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [match.params.id],
  );

  const [isCloneConfirmation, toggleCloneConfirmation] = useModalToggle();
  const [isTagsPaneOpened, toggleTagsPane] = useModalToggle();
  const [isLinesLimitExceededModalOpened, toggleLinesLimitExceededModal] = useModalToggle();
  const [isCloseOrderModalOpened, toggleCloseOrderModal] = useModalToggle();
  const [showConfirmDelete, toggleDeleteOrderConfirm] = useModalToggle();
  const [isOpenOrderModalOpened, toggleOpenOrderModal] = useModalToggle();
  const [isUnopenOrderModalOpened, toggleUnopenOrderModal] = useModalToggle();
  const reasonsForClosure = get(resources, 'closingReasons.records');
  const orderNumber = get(order, 'poNumber', '');
  const poLines = get(order, 'compositePoLines', []);
  const workflowStatus = get(order, 'workflowStatus');
  const isAbleToAddLines = workflowStatus === WORKFLOW_STATUS.pending;
  const tags = get(order, 'tags.tagList', []);

  const lastMenu = (
    <PaneMenu>
      <TagsBadge
        tagsToggle={toggleTagsPane}
        tagsQuantity={tags.length}
      />
    </PaneMenu>
  );

  const onCloneOrder = useCallback(
    () => {
      toggleCloneConfirmation();
      setIsLoading(true);
      cloneOrder(order, mutator.orderDetails, order.compositePoLines)
        .then(newOrder => {
          sendCallout({
            message: <SafeHTMLMessage id="ui-orders.order.clone.success" />,
            type: 'success',
          });
          history.push({
            pathname: `/orders/view/${newOrder.id}`,
            search: location.search,
          });
        })
        .catch(e => {
          showUpdateOrderError(e, context, orderErrorModalShow, 'clone.error');
          setIsLoading();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, history, location.search, order, orderErrorModalShow, sendCallout, toggleCloneConfirmation],
  );

  const deletePO = useCallback(
    () => {
      toggleDeleteOrderConfirm();
      setIsLoading(true);
      mutator.orderDetails.DELETE(order, { silent: true })
        .then(() => {
          sendCallout({
            message: <SafeHTMLMessage id="ui-orders.order.delete.success" values={{ orderNumber }} />,
            type: 'success',
          });
          history.replace({
            pathname: '/orders',
            search: location.search,
          });
        })
        .catch(() => {
          sendCallout({
            message: <SafeHTMLMessage id="ui-orders.errors.orderWasNotDeleted" />,
            type: 'error',
          });
          setIsLoading();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, location.search, order, orderNumber, sendCallout, toggleDeleteOrderConfirm],
  );

  const closeOrder = useCallback(
    (reason, note) => {
      const closeOrderProps = {
        workflowStatus: WORKFLOW_STATUS.closed,
        closeReason: {
          reason,
          note,
        },
      };

      toggleCloseOrderModal();
      setIsLoading(true);
      updateOrderResource(order, mutator.orderDetails, closeOrderProps)
        .then(
          () => {
            sendCallout({ message: <SafeHTMLMessage id="ui-orders.closeOrder.success" /> });

            return fetchOrder();
          },
          e => {
            showUpdateOrderError(e, context, orderErrorModalShow, 'closeOrder');
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, fetchOrder, order, orderErrorModalShow, sendCallout, toggleCloseOrderModal],
  );

  const approveOrder = useCallback(
    () => {
      setIsLoading(true);
      updateOrderResource(order, mutator.orderDetails, { approved: true })
        .then(
          () => {
            sendCallout({
              message: <SafeHTMLMessage id="ui-orders.order.approved.success" values={{ orderNumber }} />,
            });

            return fetchOrder();
          },
          e => {
            showUpdateOrderError(e, context, orderErrorModalShow);
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, fetchOrder, order, orderErrorModalShow, orderNumber, sendCallout],
  );

  const openOrder = useCallback(
    () => {
      const openOrderProps = {
        workflowStatus: WORKFLOW_STATUS.open,
      };

      toggleOpenOrderModal();
      setIsLoading(true);
      updateOrderResource(order, mutator.orderDetails, openOrderProps)
        .then(
          () => {
            sendCallout({
              message: <SafeHTMLMessage id="ui-orders.order.open.success" values={{ orderNumber }} />,
              type: 'success',
            });

            return fetchOrder();
          },
          e => {
            showUpdateOrderError(e, context, orderErrorModalShow);
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, fetchOrder, order, orderErrorModalShow, sendCallout, toggleOpenOrderModal],
  );

  const reopenOrder = useCallback(
    () => {
      const openOrderProps = {
        workflowStatus: WORKFLOW_STATUS.open,
      };

      updateOrderResource(order, mutator.orderDetails, openOrderProps)
        .then(
          () => {
            sendCallout({
              message: <SafeHTMLMessage id="ui-orders.order.reopen.success" values={{ orderNumber }} />,
              type: 'success',
            });

            return fetchOrder();
          },
          e => {
            showUpdateOrderError(e, context, orderErrorModalShow);
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, fetchOrder, order, orderErrorModalShow, sendCallout],
  );

  const unopenOrder = useCallback(
    () => {
      const orderProps = {
        workflowStatus: WORKFLOW_STATUS.pending,
      };

      toggleUnopenOrderModal();
      setIsLoading(true);
      updateOrderResource(order, mutator.orderDetails, orderProps)
        .then(
          () => {
            sendCallout({
              message: <SafeHTMLMessage id="ui-orders.order.unopen.success" values={{ orderNumber }} />,
              type: 'success',
            });

            return fetchOrder();
          },
          e => {
            showUpdateOrderError(e, context, orderErrorModalShow);
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, fetchOrder, order, orderErrorModalShow, sendCallout, toggleUnopenOrderModal],
  );

  const createNewOrder = useCallback(
    () => {
      toggleLinesLimitExceededModal();
      cloneOrder(order, mutator.orderDetails)
        .then(newOrder => {
          history.push({
            pathname: `/orders/view/${newOrder.id}/po-line/create`,
            search: location.search,
          });
        })
        .catch(e => {
          showUpdateOrderError(e, context, orderErrorModalShow, 'noCreatedOrder');
          setIsLoading();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, history, location.search, order, orderErrorModalShow, toggleLinesLimitExceededModal],
  );

  const gotToOrdersList = useCallback(
    () => {
      history.push({
        pathname: '/orders',
        search: location.search,
      });
    },
    [history, location.search],
  );

  const goToReceiving = useCallback(
    () => {
      history.push({
        pathname: '/receiving',
        search: `qindex=purchaseOrder.poNumber&query=${orderNumber}`,
      });
    },
    [orderNumber, history],
  );

  const onEdit = useCallback(
    () => {
      history.push({
        pathname: `/orders/edit/${match.params.id}`,
        search: location.search,
      });
    },
    [location.search, match.params.id, history],
  );

  const onAddPOLine = useCallback(
    () => {
      const linesLimit = Number(get(resources, ['linesLimit', 'records', '0', 'value'], LINES_LIMIT_DEFAULT));

      if (linesLimit <= poLines.length) {
        toggleLinesLimitExceededModal();
      } else {
        history.push({
          pathname: `/orders/view/${match.params.id}/po-line/create`,
          search: location.search,
        });
      }
    },
    [resources, match.params.id, history, location.search, poLines.length, toggleLinesLimitExceededModal],
  );

  const addPOLineButton = (
    <IfPermission perm="orders.po-lines.item.post">
      <Button
        data-test-add-line-button
        disabled={!isAbleToAddLines}
        onClick={onAddPOLine}
      >
        <FormattedMessage id="ui-orders.button.addLine" />
      </Button>
    </IfPermission>
  );

  if (isLoading || order?.id !== match.params.id) {
    return (
      <LoadingPane dismissible defaultWidth="fill" onClose={gotToOrdersList} />
    );
  }

  const orderType = get(order, 'orderType');
  const addresses = getAddresses(get(resources, 'addresses.records', []));
  const funds = get(resources, 'fund.records', []);
  const approvalsSetting = get(resources, 'approvalsSetting.records', {});

  const POPane = (
    <Pane
      actionMenu={getPOActionMenu({
        approvalsSetting,
        clickApprove: approveOrder,
        clickClone: toggleCloneConfirmation,
        clickClose: toggleCloseOrderModal,
        clickDelete: toggleDeleteOrderConfirm,
        clickEdit: onEdit,
        clickOpen: toggleOpenOrderModal,
        clickReceive: goToReceiving,
        clickReopen: reopenOrder,
        clickUnopen: toggleUnopenOrderModal,
        order,
      })}
      data-test-order-details
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-orders.order.paneTitle.details" values={{ orderNumber }} />}
      lastMenu={lastMenu}
      dismissible
      onClose={gotToOrdersList}
    >
      <AccordionStatus>
        <Row end="xs">
          {isCloseOrderModalOpened && (
            <CloseOrderModal
              cancel={toggleCloseOrderModal}
              closeOrder={closeOrder}
              closingReasons={reasonsForClosure}
              orderNumber={orderNumber}
            />
          )}
          {isOpenOrderModalOpened && (
            <OpenOrderConfirmationModal
              orderNumber={orderNumber}
              submit={openOrder}
              cancel={toggleOpenOrderModal}
            />
          )}

          <ExpandAllButton />
        </Row>
        <AccordionSet>
          <Accordion
            id="purchaseOrder"
            label={<FormattedMessage id="ui-orders.paneBlock.purchaseOrder" />}
          >
            <PODetailsView
              addresses={addresses}
              order={order}
            />
          </Accordion>
          {isOngoing(orderType) && (
            <Accordion
              id="ongoing"
              label={<FormattedMessage id="ui-orders.paneBlock.ongoingInfo" />}
            >
              <OngoingOrderInfoView order={order} />
            </Accordion>
          )}
          <Accordion
            id="POSummary"
            label={<FormattedMessage id="ui-orders.paneBlock.POSummary" />}
          >
            <SummaryView order={order} />
          </Accordion>
          <POInvoicesContainer
            label={<FormattedMessage id="ui-orders.paneBlock.relatedInvoices" />}
            orderId={match.params.id}
          />
          <Accordion
            displayWhenOpen={addPOLineButton}
            id="POListing"
            label={<FormattedMessage id="ui-orders.paneBlock.POLines" />}
          >
            <LineListing
              baseUrl={match.url}
              funds={funds}
              poLines={poLines}
            />
          </Accordion>
        </AccordionSet>
      </AccordionStatus>
      {isLinesLimitExceededModalOpened && (
        <LinesLimit
          cancel={toggleLinesLimitExceededModal}
          createOrder={createNewOrder}
        />
      )}
      {updateOrderErrors && (
        <UpdateOrderErrorModal
          orderNumber={orderNumber}
          errors={updateOrderErrors}
          cancel={setUpdateOrderErrors}
        />
      )}
      {showConfirmDelete && (
        <ConfirmationModal
          id="delete-order-confirmation"
          confirmLabel={<FormattedMessage id="ui-orders.order.delete.confirmLabel" />}
          heading={<FormattedMessage id="ui-orders.order.delete.heading" values={{ orderNumber }} />}
          message={<FormattedMessage id="ui-orders.order.delete.message" />}
          onCancel={toggleDeleteOrderConfirm}
          onConfirm={deletePO}
          open
        />
      )}
      {isCloneConfirmation && (
        <ConfirmationModal
          id="order-clone-confirmation"
          confirmLabel={<FormattedMessage id="ui-orders.order.clone.confirmLabel" />}
          heading={<FormattedMessage id="ui-orders.order.clone.heading" />}
          message={<FormattedMessage id="ui-orders.order.clone.message" />}
          onCancel={toggleCloneConfirmation}
          onConfirm={onCloneOrder}
          open
        />
      )}
      {isUnopenOrderModalOpened && (
        <ConfirmationModal
          id="order-unopen-confirmation"
          confirmLabel={<FormattedMessage id="ui-orders.unopenOrderModal.confirmLabel" />}
          heading={<FormattedMessage id="ui-orders.unopenOrderModal.title" values={{ orderNumber }} />}
          message={<FormattedMessage id="ui-orders.unopenOrderModal.message" />}
          onCancel={toggleUnopenOrderModal}
          onConfirm={unopenOrder}
          open
        />
      )}
    </Pane>
  );

  return (
    <>
      {POPane}
      {isTagsPaneOpened && (
        <Tags
          putMutator={mutator.orderDetails.PUT}
          recordObj={order}
          onClose={toggleTagsPane}
        />
      )}
    </>
  );
};

PO.manifest = Object.freeze({
  orderDetails: {
    ...ORDER,
    accumulate: true,
    fetch: false,
  },
  linesLimit: LINES_LIMIT,
  closingReasons: reasonsForClosureResource,
  fund: FUND,
  approvalsSetting: APPROVALS_SETTING,
  addresses: ADDRESSES,
});

PO.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(PO);
