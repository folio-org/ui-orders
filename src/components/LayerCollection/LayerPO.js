import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { get } from 'lodash';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import {
  Layer,
} from '@folio/stripes/components';
import { CalloutContext } from '@folio/stripes/core';

import { getUserNameById } from '../../common/utils';
import { updateOrderResource } from '../Utils/orderResource';
import {
  showUpdateOrderError,
} from '../Utils/order';
import POForm from '../PurchaseOrder/POForm';
import { UpdateOrderErrorModal } from '../PurchaseOrder/UpdateOrderErrorModal';

class LayerPO extends Component {
  static contextType = CalloutContext;
  static propTypes = {
    order: PropTypes.object,
    location: PropTypes.object.isRequired,
    stripes: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedPOForm = props.stripes.connect(POForm);
    this.state = {
      createdByName: '',
      assignedToUser: '',
      updateOrderError: null,
    };
  }

  componentDidMount() {
    this.setUserFields();
  }

  componentDidUpdate(prevProps) {
    if (get(this.props, 'order.id') !== get(prevProps, 'order.id')) this.setUserFields();
  }

  setUserFields = () => {
    const { order: { assignedTo, metadata }, parentMutator } = this.props;

    getUserNameById(parentMutator.users, get(metadata, 'createdByUserId'))
      .then(userName => this.setState({ createdByName: userName }));

    getUserNameById(parentMutator.users, assignedTo)
      .then(userName => this.setState({ assignedToUser: userName }));
  }

  closeErrorModal = () => {
    this.setState({ updateOrderError: null });
  };

  openOrderErrorModalShow = (errors) => {
    this.setState(() => ({ updateOrderError: errors }));
  };

  updatePO = (order) => {
    const { parentMutator, onCancel } = this.props;

    updateOrderResource(order, parentMutator.records)
      .then(({ poNumber }) => {
        this.context.sendCallout({
          message: <SafeHTMLMessage id="ui-orders.order.save.success" values={{ orderNumber: poNumber }} />,
        });
        onCancel();
      })
      .catch(async e => {
        await showUpdateOrderError(e, this.context, this.openOrderErrorModalShow);
      });
  };

  render() {
    const { order, location } = this.props;
    const { layer } = location.search ? queryString.parse(location.search) : {};
    const { updateOrderError, createdByName, assignedToUser } = this.state;
    const patchedOrder = {
      ...order,
      createdByName,
      assignedToUser,
    };

    if (layer === 'edit') {
      return (
        <Layer
          isOpen
          contentLabel="Edit Order Dialog"
        >
          <this.connectedPOForm
            {...this.props}
            initialValues={patchedOrder}
            onSubmit={this.updatePO}
          />
          {updateOrderError && (
            <UpdateOrderErrorModal
              orderNumber={patchedOrder.poNumber}
              errors={updateOrderError}
              cancel={this.closeErrorModal}
            />
          )}
        </Layer>
      );
    }

    return null;
  }
}

export default LayerPO;
