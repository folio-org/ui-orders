import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  IfPermission,
  stripesShape,
} from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Button,
  Callout,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import transitionToParams from '@folio/stripes-components/util/transitionToParams';

import { LayerPO } from '../LayerCollection';
import {
  CONFIG_API,
  ORDER_DETAIL_API,
} from '../Utils/api';
import {
  cloneOrder,
  updateOrderResource,
} from '../Utils/orderResource';
import { showUpdateOrderError } from '../Utils/order';
import {
  CONFIG_CLOSING_REASONS,
  CONFIG_LINES_LIMIT,
  LINES_LIMIT_DEFAULT,
  MODULE_ORDERS,
} from '../Utils/const';
import { ORDER_TYPE } from './PODetails/FieldOrderType';
import CloseOrderModal from './CloseOrder';
import OpenOrderConfirmationModal from './OpenOrderConfirmationModal';
import { WORKFLOW_STATUS } from './Summary/FieldWorkflowStatus';
import LineListing from './LineListing';
import { PODetailsView } from './PODetails';
import { SummaryView } from './Summary';
import { RenewalsView } from './renewals';
import LinesLimit from './LinesLimit';
import { isReceiveAvailableForOrder } from './util';
import { UpdateOrderErrorModal } from './UpdateOrderErrorModal';

import css from './PO.css';

class PO extends Component {
  static manifest = Object.freeze({
    order: {
      type: 'okapi',
      path: ORDER_DETAIL_API,
      throwErrors: false,
    },
    closingReasons: {
      type: 'okapi',
      records: 'configs',
      path: CONFIG_API,
      GET: {
        params: {
          query: `(module=${MODULE_ORDERS} and configName=${CONFIG_CLOSING_REASONS})`,
        },
      },
    },
    linesLimit: {
      type: 'okapi',
      records: 'configs',
      path: CONFIG_API,
      GET: {
        params: {
          query: `(module=${MODULE_ORDERS} and configName=${CONFIG_LINES_LIMIT})`,
        },
      },
    },
  });

  static propTypes = {
    mutator: PropTypes.shape({
      order: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
    location: ReactRouterPropTypes.location.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    stripes: stripesShape.isRequired,
    onCloseEdit: PropTypes.func,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
    onCancel: PropTypes.func,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
    editLink: PropTypes.string,
    paneWidth: PropTypes.string.isRequired,
    resources: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        purchaseOrder: true,
        POSummary: true,
        POListing: true,
        renewals: true,
      },
      isCloseOrderModalOpened: false,
      isLinesLimitExceededModalOpened: false,
      updateOrderErrorCode: null,
    };
    this.transitionToParams = transitionToParams.bind(this);
  }

  onToggleSection = ({ id }) => {
    this.setState(({ sections }) => {
      const isSectionOpened = sections[id];

      return {
        sections: {
          ...sections,
          [id]: !isSectionOpened,
        },
      };
    });
  };

  handleExpandAll = (sections) => {
    this.setState({ sections });
  };

  openReceiveItem = (e) => {
    if (e) e.preventDefault();
    this.transitionToParams({ layer: 'receive-items' });
  };

  openReceived = (e) => {
    if (e) e.preventDefault();
    this.transitionToParams({ layer: 'received' });
  };

  onAddPOLine = () => {
    const { resources } = this.props;
    const linesLimit = Number(get(resources, ['linesLimit', 'records', '0', 'value'], LINES_LIMIT_DEFAULT));
    const poLines = get(resources, ['order', 'records', '0', 'compositePoLines'], []);

    if (linesLimit <= poLines.length) {
      this.setState({ isLinesLimitExceededModalOpened: true });
    } else {
      this.transitionToParams({ layer: 'create-po-line' });
    }
  };

  closeOrder = (reason, note) => {
    const { mutator, resources } = this.props;
    const order = get(resources, ['order', 'records', 0]);
    const closeOrderProps = {
      workflowStatus: WORKFLOW_STATUS.closed,
      closeReason: {
        reason,
        note,
      },
    };

    updateOrderResource(order, mutator.order, closeOrderProps);
    this.unmountCloseOrderModal();
  };

  openOrder = async () => {
    const { mutator, resources } = this.props;
    const order = get(resources, ['order', 'records', 0]);
    const openOrderProps = {
      workflowStatus: WORKFLOW_STATUS.open,
    };

    try {
      await updateOrderResource(order, mutator.order, openOrderProps);
    } catch (e) {
      await showUpdateOrderError(e, this.callout, this.openOrderErrorModalShow);
    } finally {
      this.toggleOpenOrderModal();
    }
  };

  createNewOrder = async () => {
    const { resources, parentMutator } = this.props;
    const order = get(resources, ['order', 'records', '0'], {});

    try {
      const newOrder = await cloneOrder(order, parentMutator.records);

      parentMutator.query.update({
        _path: `/orders/view/${newOrder.id}`,
        layer: null,
      });
      this.transitionToParams({ layer: 'create-po-line' });
    } catch (e) {
      this.callout.sendCallout({
        message: <FormattedMessage id="ui-orders.errors.noCreatedOrder" />,
        type: 'error',
      });
    } finally {
      this.unmountLinesLimitExceededModal();
    }
  };

  addPOLineButton = (isAbleToAddLines) => (
    <Button
      data-test-add-line-button
      disabled={!isAbleToAddLines}
      onClick={this.onAddPOLine}
    >
      <FormattedMessage id="ui-orders.button.addLine" />
    </Button>
  );

  toggleOpenOrderModal = () => {
    this.setState(prevState => ({ isOpenOrderModalOpened: !prevState.isOpenOrderModalOpened }));
  };

  mountCloseOrderModal = () => {
    this.setState({ isCloseOrderModalOpened: true });
  };

  unmountCloseOrderModal = () => {
    this.setState({ isCloseOrderModalOpened: false });
  };

  mountLinesLimitExceededModal = () => {
    this.setState({ isLinesLimitExceededModalOpened: true });
  };

  unmountLinesLimitExceededModal = () => {
    this.setState({ isLinesLimitExceededModalOpened: false });
  };

  closeErrorModal = () => {
    this.setState({ updateOrderErrorCode: null });
  };

  openOrderErrorModalShow = (errorCode) => {
    this.setState(() => ({ updateOrderErrorCode: errorCode }));
  };

  createCalloutRef = ref => {
    this.callout = ref;
  };

  goToReceiving = () => {
    const { match: { params: { id } }, parentMutator: { query } } = this.props;

    query.replace({
      _path: `/orders/view/${id}/receiving`,
    });
  };

  render() {
    const {
      editLink,
      history,
      location,
      match,
      onClose,
      onCloseEdit,
      onEdit,
      parentMutator,
      parentResources,
      resources,
      stripes,
    } = this.props;
    const order = get(resources, ['order', 'records', 0]);
    const orderNumber = get(order, 'poNumber', '');
    const poLines = get(order, 'compositePoLines', []);
    const workflowStatus = get(order, 'workflowStatus');
    const isCloseOrderButtonVisible = workflowStatus === WORKFLOW_STATUS.open;
    const isOpenOrderButtonVisible = workflowStatus === WORKFLOW_STATUS.pending && poLines.length > 0;
    const isReceiveButtonVisible = isReceiveAvailableForOrder(order);
    const isAbleToAddLines = workflowStatus === WORKFLOW_STATUS.pending;

    const lastMenu = (
      <PaneMenu>
        <IfPermission perm="orders.item.put">
          <FormattedMessage id="ui-orders.paneMenu.editOrder">
            {ariaLabel => (
              <IconButton
                ariaLabel={ariaLabel}
                data-test-order-edit
                icon="edit"
                style={{ visibility: !order ? 'hidden' : 'visible' }}
                onClick={onEdit}
                href={editLink}
              />
            )}
          </FormattedMessage>
        </IfPermission>
      </PaneMenu>
    );

    if (!order) {
      return (
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-podetails"
          lastMenu={lastMenu}
          onClose={onClose}
          paneTitle={<FormattedMessage id="ui-orders.order.paneTitle.detailsLoading" />}
        >
          <Icon icon="spinner-ellipsis" width="100px" />
        </Pane>
      );
    }

    const vendor = get(parentResources, 'vendors.records', []).find(d => d.id === order.vendor);
    const assignedTo = get(parentResources, 'users.records', []).find(d => d.id === order.assignedTo);
    const createdByUserId = get(order, 'metadata.createdByUserId');
    const createdBy = get(parentResources, 'users.records', []).find(d => d.id === createdByUserId);
    const isOngoing = get(order, 'orderType') === ORDER_TYPE.ongoing;

    order.vendorName = get(vendor, 'name');
    order.assignedToUser = assignedTo && assignedTo.personal
      ? `${assignedTo.personal.firstName} ${assignedTo.personal.lastName}`
      : '';
    order.createdByName = createdBy && createdBy.personal
      ? `${createdBy.personal.firstName} ${createdBy.personal.lastName}`
      : '';

    const { updateOrderErrorCode } = this.state;

    return (
      <Pane
        data-test-order-details
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-orders.order.paneTitle.details" values={{ orderNumber }} />}
        lastMenu={lastMenu}
        dismissible
        onClose={onClose}
      >
        <Row end="xs">
          {isReceiveButtonVisible && (
            <div className={css.buttonWrapper}>
              <Button
                buttonStyle="primary"
                className={css.button}
                data-test-receiving-button
                onClick={this.goToReceiving}
              >
                <FormattedMessage id="ui-orders.paneBlock.receiveBtn" />
              </Button>
            </div>
          )}
          {isCloseOrderButtonVisible && (
            <div className={css.buttonWrapper}>
              <Button
                buttonStyle="primary"
                className={css.button}
                onClick={this.mountCloseOrderModal}
              >
                <FormattedMessage id="ui-orders.paneBlock.closeBtn" />
              </Button>
            </div>
          )}
          {isOpenOrderButtonVisible && (
            <div className={css.buttonWrapper}>
              <Button
                buttonStyle="primary"
                className={css.button}
                data-test-open-order-button
                onClick={this.toggleOpenOrderModal}
              >
                <FormattedMessage id="ui-orders.paneBlock.openBtn" />
              </Button>
            </div>
          )}
          {this.state.isCloseOrderModalOpened && (
            <CloseOrderModal
              cancel={this.unmountCloseOrderModal}
              closeOrder={this.closeOrder}
              closingReasons={resources.closingReasons.records}
              orderNumber={orderNumber}
            />
          )}
          {this.state.isOpenOrderModalOpened && (
            <OpenOrderConfirmationModal
              orderNumber={orderNumber}
              submit={this.openOrder}
              cancel={this.toggleOpenOrderModal}
            />
          )}
          <div>
            <ExpandAllButton
              accordionStatus={this.state.sections}
              onToggle={this.handleExpandAll}
            />
          </div>
        </Row>
        <AccordionSet accordionStatus={this.state.sections} onToggle={this.onToggleSection}>
          <Accordion
            id="purchaseOrder"
            label={<FormattedMessage id="ui-orders.paneBlock.purchaseOrder" />}
          >
            <PODetailsView order={order} {...this.props} />
          </Accordion>
          {isOngoing && (
            <Accordion
              id="renewals"
              label={<FormattedMessage id="ui-orders.paneBlock.renewals" />}
            >
              <RenewalsView order={order} />
            </Accordion>
          )}
          <Accordion
            id="POSummary"
            label={<FormattedMessage id="ui-orders.paneBlock.POSummary" />}
          >
            <SummaryView order={order} {...this.props} />
          </Accordion>
          <Accordion
            displayWhenOpen={this.addPOLineButton(isAbleToAddLines)}
            id="POListing"
            label={<FormattedMessage id="ui-orders.paneBlock.POLines" />}
          >
            <LineListing poLines={poLines} {...this.props} />
          </Accordion>
        </AccordionSet>
        <LayerPO
          order={order}
          location={location}
          stripes={stripes}
          onCancel={onCloseEdit}
          history={history}
          match={match}
          parentResources={parentResources}
          parentMutator={parentMutator}
        />
        {this.state.isLinesLimitExceededModalOpened && (
          <LinesLimit
            cancel={this.unmountLinesLimitExceededModal}
            createOrder={this.createNewOrder}
          />
        )}
        {updateOrderErrorCode && (
          <UpdateOrderErrorModal
            orderNumber={orderNumber}
            errorCode={updateOrderErrorCode}
            cancel={this.closeErrorModal}
          />
        )}
        <Callout ref={this.createCalloutRef} />
      </Pane>
    );
  }
}

export default PO;
