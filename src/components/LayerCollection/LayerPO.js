import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import ReactRouterPropTypes from 'react-router-prop-types';
import { getFormValues } from 'redux-form';

import { LoadingPane } from '@folio/stripes/components';
import {
  CalloutContext,
  stripesConnect,
} from '@folio/stripes/core';

import { PO_FORM_NAME } from '../../common/constants';
import {
  prefixesResource,
  suffixesResource,
} from '../../common/resources';
import { getUserNameById } from '../../common/utils';
import {
  ORDER_NUMBER_API,
  ORDER_NUMBER_VALIDATE_API,
} from '../Utils/api';
import {
  createOrderResource,
  updateOrderResource,
} from '../Utils/orderResource';
import {
  ADDRESSES,
  ORDER,
  ORDER_NUMBER_SETTING,
  ORDER_TEMPLATES,
  USERS,
} from '../Utils/resources';
import {
  showUpdateOrderError,
} from '../Utils/order';
import POForm from '../PurchaseOrder/POForm';
import { UpdateOrderErrorModal } from '../PurchaseOrder/UpdateOrderErrorModal';

class LayerPO extends Component {
  static contextType = CalloutContext;
  static manifest = Object.freeze({
    order: {
      ...ORDER,
      accumulate: true,
      fetch: false,
    },
    addresses: ADDRESSES,
    users: {
      ...USERS,
      accumulate: true,
      fetch: false,
    },
    orderNumber: {
      accumulate: true,
      fetch: false,
      path: ORDER_NUMBER_API,
      throwErrors: false,
      clientGeneratePk: false,
      type: 'okapi',
      POST: {
        path: ORDER_NUMBER_VALIDATE_API,
      },
    },
    orderNumberSetting: ORDER_NUMBER_SETTING,
    prefixesSetting: prefixesResource,
    suffixesSetting: suffixesResource,
    orderTemplates: ORDER_TEMPLATES,
  });

  static propTypes = {
    order: PropTypes.object,
    location: ReactRouterPropTypes.location.isRequired,
    stripes: PropTypes.object.isRequired,
    history: ReactRouterPropTypes.history.isRequired,
    match: ReactRouterPropTypes.match.isRequired,
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      updateOrderError: null,
      patchedOrder: {},
    };
  }

  componentDidMount() {
    const { match: { params: { id } }, mutator } = this.props;

    if (id) {
      this.props.mutator.order.GET()
        .then(o => Promise.all([
          o,
          getUserNameById(mutator.users, o.metadata?.createdByUserId),
          getUserNameById(mutator.users, o.assignedTo),
        ]), () => {
          setTimeout(() => this.context?.sendCallout({
            message: `Unable to load the order ${id}`,
            type: 'error',
            timeout: 0,
          }));

          return Promise.reject();
        })
        .then(([o, createdByName, assignedToUser]) => {
          this.setState({
            patchedOrder: {
              ...o,
              createdByName,
              assignedToUser,
            },
          });
        });
    }
  }

  goToOrderDetails = () => {
    const { history, location, match: { params: { id } } } = this.props;

    history.push({
      pathname: `/orders/view/${id}`,
      search: location.search,
    });
  }

  goToOrders = () => {
    const { history, location } = this.props;

    history.push({
      pathname: '/orders',
      search: location.search,
    });
  }

  closeErrorModal = () => {
    this.setState({ updateOrderError: null });
  };

  openOrderErrorModalShow = (errors) => {
    this.setState(() => ({ updateOrderError: errors }));
  };

  updatePO = (order) => {
    const { history, location, mutator } = this.props;
    const saveFn = order.id
      ? updateOrderResource
      : createOrderResource;

    return saveFn(order, mutator.order)
      .then(({ id, poNumber }) => {
        this.context?.sendCallout({
          message: <SafeHTMLMessage id="ui-orders.order.save.success" values={{ orderNumber: poNumber }} />,
        });
        setTimeout(() => history.push({
          pathname: `/orders/view/${id}`,
          search: location.search,
        }));
      })
      .catch(async e => {
        await showUpdateOrderError(e, this.context, this.openOrderErrorModalShow);
      });
  };

  render() {
    const {
      match,
      mutator,
      resources,
      stripes,
    } = this.props;
    const id = match.params.id;
    const { updateOrderError, patchedOrder } = this.state;

    if (id && patchedOrder.id !== id) return <LoadingPane dismissible defaultWidth="fill" onClose={this.goToOrders} />;

    const formValues = getFormValues(PO_FORM_NAME)(stripes.store.getState());

    return (
      <>
        <POForm
          formValues={formValues}
          initialValues={patchedOrder}
          onCancel={id ? this.goToOrderDetails : this.goToOrders}
          onSubmit={this.updatePO}
          parentMutator={mutator}
          parentResources={resources}
          stripes={stripes}
        />
        {updateOrderError && (
          <UpdateOrderErrorModal
            orderNumber={patchedOrder.poNumber}
            errors={updateOrderError}
            cancel={this.closeErrorModal}
          />
        )}
      </>
    );
  }
}

export default stripesConnect(LayerPO);
