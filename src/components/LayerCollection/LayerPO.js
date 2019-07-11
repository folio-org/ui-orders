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
      updateOrderError: null,
      data: this.props.order,
    };
  }

  componentDidMount() {
    this.setState({ data: this.props.order });
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
      .then(() => onCancel())
      .catch(async e => {
        await showUpdateOrderError(e, this.callout, this.openOrderErrorModalShow);
      });
  };

  updateInitialData = (data) => this.setState(prevState => ({
    data: { ...prevState.data, ...data },
  }));

  render() {
    const { order, location } = this.props;
    const { layer } = location.search ? queryString.parse(location.search) : {};
    const { updateOrderError } = this.state;

    if (layer === 'edit') {
      return (
        <Layer
          isOpen
          contentLabel="Edit Order Dialog"
        >
          <this.connectedPOForm
            {...this.props}
            initialValues={order}
            updateInitialData={this.updateInitialData}
            onSubmit={this.updatePO}
          />
          {updateOrderError && (
            <UpdateOrderErrorModal
              orderNumber={order.poNumber}
              errors={updateOrderError}
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
