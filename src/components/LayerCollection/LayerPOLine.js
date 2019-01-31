import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  cloneDeep,
  get,
} from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import {
  Callout,
  Layer,
} from '@folio/stripes/components';

import transitionToParams from '../Utils/transitionToParams';
import { SOURCE_FOLIO_CODE } from '../Utils/const';
import { cloneOrder } from '../Utils/orderResource';
import { POLineForm } from '../POLine';
import { CURRENCY } from '../POLine/Cost/FieldCurrency';
import LinesLimit from '../PurchaseOrder/LinesLimit';

class LayerPOLine extends Component {
  static propTypes = {
    location: ReactRouterPropTypes.location.isRequired,
    history: ReactRouterPropTypes.history,
    match: ReactRouterPropTypes.match,
    parentMutator: PropTypes.object.isRequired,
    parentResources: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      store: PropTypes.object.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    line: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    order: PropTypes.object,
    lineMutator: PropTypes.shape({
      POST: PropTypes.func,
      PUT: PropTypes.func,
      DELETE: PropTypes.func,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLinesLimitExceededModalOpened: false,
      line: null,
    };
    this.transitionToParams = transitionToParams.bind(this);
    this.connectedPOLineForm = props.stripes.connect(POLineForm);
  }

  openLineLimitExceededModal = (line) => {
    this.setState({
      isLinesLimitExceededModalOpened: true,
      line,
    });
  }

  closeLineLimitExceededModal = () => {
    this.setState({
      isLinesLimitExceededModalOpened: false,
      line: null,
    });
  }

  submitPOLine = (line) => {
    const newLine = cloneDeep(line);
    const { lineMutator, onCancel } = this.props;

    lineMutator.POST(newLine)
      .then(() => onCancel())
      .catch(async e => {
        let response;

        try {
          response = await e.json();
        } catch (parsingException) {
          response = e;
        }
        if (response.errors && response.errors.find(el => el.code === 'lines_limit')) {
          this.openLineLimitExceededModal(line);
        } else {
          this.callout.sendCallout({
            message: <FormattedMessage id="ui-orders.errors.lineWasNotCreated" />,
            type: 'error',
          });
        }
      });
  }

  createNewOrder = async () => {
    const { order, parentMutator } = this.props;

    try {
      const newOrder = await cloneOrder(order, parentMutator.records, this.state.line);

      parentMutator.query.update({
        _path: `/orders/view/${newOrder.id}`,
        layer: null,
      });
    } catch (e) {
      this.callout.sendCallout({
        message: <FormattedMessage id="ui-orders.errors.noCreatedOrder" />,
        type: 'error',
      });
    } finally {
      this.closeLineLimitExceededModal();
    }
  }

  updatePOLine = (data) => {
    const line = cloneDeep(data);
    const { lineMutator, parentMutator, location: { pathname } } = this.props;

    // remove sample data from payload to prevent errors on saving sample lines
    delete line.agreement_id;
    delete line.instance_id;
    delete line.location;
    if (line.eresource) {
      delete line.eresource.license;
    }
    if (line.adjustment) {
      delete line.adjustment.invoice_id;
    }

    const materialSupplier = get(line, 'physical.material_supplier');
    const accessProvider = get(line, 'eresource.access_provider');

    if (materialSupplier === '') {
      line.physical.material_supplier = null;
    }
    if (accessProvider === '') {
      line.eresource.access_provider = null;
    }

    lineMutator.PUT(line).then(() => {
      parentMutator.query.update({
        _path: `${pathname}`,
        layer: null,
      });
    });
  }

  deletePOLine = (lineId) => {
    const { lineMutator, order, parentMutator } = this.props;

    lineMutator.DELETE({ id: lineId }).then(() => {
      parentMutator.query.update({
        _path: `/orders/view/${order.id}`,
        layer: null,
      });
    });
  }

  getCreatePOLIneInitialValues() {
    const { match, order = {} } = this.props;
    const orderId = get(match, 'params.id');
    const lineSuffix = get(order, 'po_lines', []).length + 1;

    const newObj = {
      source: {
        code: SOURCE_FOLIO_CODE,
      },
      cost: {
        currency: CURRENCY.usd,
      },
      vendor_detail: {
        instructions: '',
      },
    };

    // Due to not perfect component hierarchy, the 'real' new PO Line goes only if orderId is not falsy
    if (orderId) {
      newObj.purchase_order_id = orderId;
      newObj.po_line_number = `${order.po_number}-${lineSuffix}`;
    }

    return newObj;
  }

  createCalloutRef = ref => {
    this.callout = ref;
  };

  render() {
    const { line, location } = this.props;
    const { layer } = location.search ? queryString.parse(location.search) : {};

    if (layer === 'create-po-line') {
      return (
        <Layer
          isOpen
          contentLabel="Create PO Line Dialog"
        >
          <this.connectedPOLineForm
            {...this.props}
            initialValues={this.getCreatePOLIneInitialValues()}
            onSubmit={this.submitPOLine}
          />
          {this.state.isLinesLimitExceededModalOpened && (
          <LinesLimit
            cancel={this.closeLineLimitExceededModal}
            createOrder={this.createNewOrder}
          />
          )}
          <Callout ref={this.createCalloutRef} />
        </Layer>
      );
    } else if (layer === 'edit-po-line') {
      return (
        <Layer
          isOpen
          contentLabel="Edit PO Line Dialog"
        >
          <this.connectedPOLineForm
            {...this.props}
            initialValues={line}
            onSubmit={this.updatePOLine}
            deletePOLine={this.deletePOLine}
          />
        </Layer>
      );
    }

    return null;
  }
}

export default LayerPOLine;
