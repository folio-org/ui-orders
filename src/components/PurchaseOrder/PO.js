import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { get } from 'lodash';

import {
  CalloutContext,
  IfPermission,
  stripesShape,
} from '@folio/stripes/core';
import { withTags } from '@folio/stripes/smart-components';
import {
  Accordion,
  AccordionSet,
  Button,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import {
  getAddresses,
  getClosingReasonsOptions,
} from '../../common/utils';
import { isOngoing } from '../../common/POFields';
import { WORKFLOW_STATUS } from '../../common/constants';
import { LayerPO } from '../LayerCollection';
import {
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

class PO extends Component {
  static contextType = CalloutContext;
  static manifest = Object.freeze({
    order: ORDER,
    linesLimit: LINES_LIMIT,
  });

  static propTypes = {
    connectedSource: PropTypes.object.isRequired,
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
    tagsToggle: PropTypes.func.isRequired,
    tagsEnabled: PropTypes.bool,
  };

  static defaultProps = {
    tagsEnabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        purchaseOrder: true,
        POSummary: true,
        POListing: true,
        renewals: true,
        relatedInvoices: true,
      },
      isCloseOrderModalOpened: false,
      isLinesLimitExceededModalOpened: false,
      isCloneConfirmation: false,
      updateOrderError: null,
      showConfirmDelete: false,
    };
    this.transitionToParams = values => this.props.parentMutator.query.update(values);
    this.hasError = false;
  }

  toggleCloneConfirmation = () => {
    this.setState(prevState => ({ isCloneConfirmation: !prevState.isCloneConfirmation }));
  };

  deletePO = () => {
    const { parentMutator } = this.props;
    const order = this.getOrder();
    const orderNumber = order.poNumber;

    parentMutator.records.DELETE(order)
      .then(() => {
        this.context.sendCallout({
          message: <SafeHTMLMessage id="ui-orders.order.delete.success" values={{ orderNumber }} />,
          type: 'success',
        });
        parentMutator.query.update({
          _path: '/orders',
          layer: null,
        });
      })
      .catch(() => {
        this.context.sendCallout({
          message: <SafeHTMLMessage id="ui-orders.errors.orderWasNotDeleted" />,
          type: 'error',
        });
      });
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

    updateOrderResource(order, mutator.order, closeOrderProps)
      .then(() => this.context.sendCallout({ message: <SafeHTMLMessage id="ui-orders.closeOrder.success" /> }))
      .catch(() => this.context.sendCallout({
        message: <SafeHTMLMessage id="ui-orders.closeOrder.error" />,
        type: 'error',
      }))
      .finally(() => this.unmountCloseOrderModal());
  };

  approveOrder = () => {
    const { mutator } = this.props;
    const order = this.getOrder();
    const orderNumber = get(order, 'poNumber', '');

    updateOrderResource(order, mutator.order, { approved: true })
      .then(() => {
        this.context.sendCallout({
          message: <SafeHTMLMessage id="ui-orders.order.approved.success" values={{ orderNumber }} />,
        });
      })
      .catch(e => {
        return showUpdateOrderError(e, this.context, this.orderErrorModalShow);
      });
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
      await showUpdateOrderError(e, this.context, this.orderErrorModalShow);
    } finally {
      this.toggleOpenOrderModal();
    }
  };

  reopenOrder = async () => {
    const { mutator } = this.props;
    const order = this.getOrder();
    const openOrderProps = {
      workflowStatus: WORKFLOW_STATUS.open,
    };

    try {
      await updateOrderResource(order, mutator.order, openOrderProps);
      this.context.sendCallout({
        message: <SafeHTMLMessage id="ui-orders.order.reopen.success" values={{ orderNumber: order.poNumber }} />,
        type: 'success',
      });
    } catch (e) {
      await showUpdateOrderError(e, this.context, this.orderErrorModalShow);
    }
  };

  cloneOrder = async () => {
    const { location, history, parentMutator } = this.props;
    const order = this.getOrder();

    this.toggleCloneConfirmation();
    try {
      const newOrder = await cloneOrder(order, parentMutator.records, order.compositePoLines);

      this.context.sendCallout({
        message: <SafeHTMLMessage id="ui-orders.order.clone.success" />,
        type: 'success',
      });
      history.push({
        pathname: `/orders/view/${newOrder.id}`,
        search: location.search,
      });
    } catch (e) {
      this.context.sendCallout({
        message: <SafeHTMLMessage id="ui-orders.order.clone.error" />,
        type: 'error',
      });
    }
  };

  createNewOrder = async () => {
    const { resources, parentMutator } = this.props;
    const order = get(resources, ['order', 'records', '0'], {});

    this.unmountLinesLimitExceededModal();
    try {
      const newOrder = await cloneOrder(order, parentMutator.records);

      parentMutator.query.update({
        _path: `/orders/view/${newOrder.id}`,
        layer: null,
      });
      this.transitionToParams({ layer: 'create-po-line' });
    } catch (e) {
      this.context.sendCallout({
        message: <FormattedMessage id="ui-orders.errors.noCreatedOrder" />,
        type: 'error',
      });
    }
  };

  addPOLineButton = (isAbleToAddLines) => (
    <IfPermission perm="orders.po-lines.item.post">
      <Button
        data-test-add-line-button
        disabled={!isAbleToAddLines}
        onClick={this.onAddPOLine}
      >
        <FormattedMessage id="ui-orders.button.addLine" />
      </Button>
    </IfPermission>
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
    this.setState({ updateOrderError: null });
  };

  orderErrorModalShow = (errors) => {
    this.setState(() => ({ updateOrderError: errors }));
  };

  goToReceiving = () => {
    const { history } = this.props;
    const order = this.getOrder();

    history.push({
      pathname: '/receiving',
      search: `qindex=purchaseOrder.poNumber&query=${order.poNumber}`,
    });
  };

  getOrder = () => get(this.props.resources, ['order', 'records', 0]);

  mountDeleteOrderConfirm = () => this.setState({ showConfirmDelete: true });

  unmountDeleteOrderConfirm = () => this.setState({ showConfirmDelete: false });

  render() {
    const {
      connectedSource,
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
      tagsEnabled,
      tagsToggle,
    } = this.props;
    const order = this.getOrder();
    const closingReasons = get(parentResources, 'closingReasons.records', []);
    const orderNumber = get(order, 'poNumber', '');
    const poLines = get(order, 'compositePoLines', []);
    const workflowStatus = get(order, 'workflowStatus');
    const isAbleToAddLines = workflowStatus === WORKFLOW_STATUS.pending;
    const hasError = get(resources, ['order', 'failed']);
    const tags = get(order, 'tags.tagList', []);

    const lastMenu = (
      <PaneMenu>
        {tagsEnabled && (
          <FormattedMessage id="ui-orders.showTags">
            {(title) => (
              <IconButton
                ariaLabel={title}
                badgeCount={tags.length}
                data-test-order-tags-action
                icon="tag"
                id="clickable-show-tags"
                onClick={tagsToggle}
                title={title}
              />
            )}
          </FormattedMessage>
        )}
      </PaneMenu>
    );

    if (hasError && !this.hasError) {
      this.context.sendCallout({
        message: <SafeHTMLMessage id="ui-orders.errors.orderNotLoaded" />,
        type: 'error',
      });
    }

    this.hasError = hasError;

    if (!order || hasError) {
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

    const orderType = get(order, 'orderType');
    const addresses = getAddresses(get(parentResources, 'addresses.records', []));
    const funds = get(parentResources, 'fund.records', []);
    const approvalsSetting = get(parentResources, 'approvalsSetting.records', {});
    const reasonsForClosure = getClosingReasonsOptions(closingReasons);

    const { isCloneConfirmation, updateOrderError } = this.state;

    return (
      <Pane
        actionMenu={getPOActionMenu({
          approvalsSetting,
          clickApprove: this.approveOrder,
          clickClone: this.toggleCloneConfirmation,
          clickClose: this.mountCloseOrderModal,
          clickDelete: this.mountDeleteOrderConfirm,
          clickEdit: onEdit,
          clickOpen: this.toggleOpenOrderModal,
          clickReceive: this.goToReceiving,
          clickReopen: this.reopenOrder,
          order,
        })}
        data-test-order-details
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-orders.order.paneTitle.details" values={{ orderNumber }} />}
        lastMenu={lastMenu}
        dismissible
        onClose={onClose}
      >
        <Row end="xs">
          {this.state.isCloseOrderModalOpened && (
            <CloseOrderModal
              cancel={this.unmountCloseOrderModal}
              closeOrder={this.closeOrder}
              closingReasons={reasonsForClosure}
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
            <SummaryView order={order} {...this.props} />
          </Accordion>
          <POInvoicesContainer
            label={<FormattedMessage id="ui-orders.paneBlock.relatedInvoices" />}
            orderId={order.id}
          />
          <Accordion
            displayWhenOpen={this.addPOLineButton(isAbleToAddLines)}
            id="POListing"
            label={<FormattedMessage id="ui-orders.paneBlock.POLines" />}
          >
            <LineListing
              baseUrl={match.url}
              funds={funds}
              poLines={poLines}
              queryMutator={parentMutator.query}
            />
          </Accordion>
        </AccordionSet>
        <LayerPO
          connectedSource={connectedSource}
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
        {updateOrderError && (
          <UpdateOrderErrorModal
            orderNumber={orderNumber}
            errors={updateOrderError}
            cancel={this.closeErrorModal}
          />
        )}
        {this.state.showConfirmDelete && (
          <ConfirmationModal
            id="delete-order-confirmation"
            confirmLabel={<FormattedMessage id="ui-orders.order.delete.confirmLabel" />}
            heading={<FormattedMessage id="ui-orders.order.delete.heading" values={{ orderNumber }} />}
            message={<FormattedMessage id="ui-orders.order.delete.message" />}
            onCancel={this.unmountDeleteOrderConfirm}
            onConfirm={this.deletePO}
            open
          />
        )}
        {isCloneConfirmation && (
          <ConfirmationModal
            id="order-clone-confirmation"
            confirmLabel={<FormattedMessage id="ui-orders.order.clone.confirmLabel" />}
            heading={<FormattedMessage id="ui-orders.order.clone.heading" />}
            message={<FormattedMessage id="ui-orders.order.clone.message" />}
            onCancel={this.toggleCloneConfirmation}
            onConfirm={this.cloneOrder}
            open
          />
        )}
      </Pane>
    );
  }
}

export default withTags(PO);
