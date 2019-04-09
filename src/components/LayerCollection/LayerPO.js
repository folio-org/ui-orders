import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import {
  Callout,
  Layer,
} from '@folio/stripes/components';

import { updateOrderResource } from '../Utils/orderResource';
import { showUpdateOrderError } from '../Utils/order';
import { POForm } from '../PurchaseOrder';
import { UpdateOrderErrorModal } from '../PurchaseOrder/UpdateOrderErrorModal';

class LayerPO extends Component {
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
    this.callout = React.createRef();
    this.state = {
      updateOrderErrorCode: null,
    };
  }

  closeErrorModal = () => {
    this.setState({ updateOrderErrorCode: null });
  };

  openOrderErrorModalShow = (errorCode) => {
    this.setState(() => ({ updateOrderErrorCode: errorCode }));
  };

  updatePO = (order) => {
    const { parentMutator, onCancel } = this.props;

    updateOrderResource(order, parentMutator.records)
      .then(() => onCancel())
      .catch(async e => {
        await showUpdateOrderError(e, this.callout, this.openOrderErrorModalShow);
      });
  };

  render() {
    const { order, location } = this.props;
    const { layer } = location.search ? queryString.parse(location.search) : {};
    const { updateOrderErrorCode } = this.state;

    if (layer === 'edit') {
      return (
        <Layer
          isOpen
          contentLabel="Edit Order Dialog"
        >
          <this.connectedPOForm
            {...this.props}
            initialValues={order}
            onSubmit={this.updatePO}
          />
          {updateOrderErrorCode && (
            <UpdateOrderErrorModal
              orderNumber={order.poNumber}
              errorCode={updateOrderErrorCode}
              cancel={this.closeErrorModal}
            />
          )}
          <Callout ref={this.callout} />
        </Layer>
      );
    }

    return null;
  }
}

export default LayerPO;
