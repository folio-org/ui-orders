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

import {
  CONFIG_CREATE_INVENTORY,
  MODULE_ORDERS,
  SOURCE_FOLIO_CODE,
} from '../Utils/const';
import { CONFIG_API } from '../Utils/api';
import getCreateInventorySetting from '../Utils/getCreateInventorySetting';
import { DISCOUNT_TYPE } from '../POLine/const';
import { cloneOrder } from '../Utils/orderResource';
import {
  lineMutatorShape,
  orderRecordsMutatorShape,
} from '../Utils/mutators';
import { ORDER } from '../Utils/resources';
import { POLineForm } from '../POLine';
import { CURRENCY } from '../POLine/Cost/FieldCurrency';
import LinesLimit from '../PurchaseOrder/LinesLimit';

const ERROR_CODES = {
  accessProviderIsInactive: 'accessProviderIsInactive',
  accessProviderNotFound: 'accessProviderNotFound',
  costQtyPhysicalExceedsLoc: 'costQtyPhysicalExceedsLoc',
  locQtyElectronicExceedsCost: 'locQtyElectronicExceedsCost',
  locQtyPhysicalExceedsCost: 'locQtyPhysicalExceedsCost',
  materialTypeRequired: 'materialTypeRequired',
  nonZeroCostQtyElectronic: 'nonZeroCostQtyElectronic',
  nonZeroLocQtyPhysical: 'nonZeroLocQtyPhysical',
  orderNotFound: 'orderNotFound',
  zeroCostQty: 'zeroCostQty',
  zeroCostQtyElectronic: 'zeroCostQtyElectronic',
  zeroCostQtyPhysical: 'zeroCostQtyPhysical',
};

class LayerPOLine extends Component {
  static manifest = Object.freeze({
    order: ORDER,
    createInventory: {
      type: 'okapi',
      records: 'configs',
      path: CONFIG_API,
      GET: {
        params: {
          query: `(module=${MODULE_ORDERS} and configName=${CONFIG_CREATE_INVENTORY})`,
        },
      },
    },
  })

  static propTypes = {
    location: ReactRouterPropTypes.location.isRequired,
    match: ReactRouterPropTypes.match,
    parentMutator: PropTypes.shape({
      poLine: lineMutatorShape,
      records: orderRecordsMutatorShape,
    }),
    parentResources: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      store: PropTypes.object.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    resources: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLinesLimitExceededModalOpened: false,
      line: null,
    };
    this.connectedPOLineForm = props.stripes.connect(POLineForm);
    this.callout = React.createRef();
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

  handleErrorResponse = async (e, line) => {
    let response;

    try {
      response = await e.json();
    } catch (parsingException) {
      response = e;
    }
    if (response.errors && response.errors.length) {
      if (response.errors.find(el => el.code === 'lines_limit')) {
        this.openLineLimitExceededModal(line);
      } else {
        const messageCode = get(ERROR_CODES, response.errors[0].code, 'lineWasNotCreated');

        this.callout.current.sendCallout({
          message: <FormattedMessage id={`ui-orders.errors.${messageCode}`} />,
          type: 'error',
        });
      }
    }
  }

  submitPOLine = (line) => {
    const newLine = cloneDeep(line);
    const { parentMutator: { poLine }, onCancel } = this.props;

    poLine.POST(newLine)
      .then(() => onCancel())
      .catch(e => this.handleErrorResponse(e, line));
  }

  getOrder = () => get(this.props, 'resources.order.records.0');

  getLine = () => {
    const { match: { params: { lineId } } } = this.props;
    const lines = get(this.getOrder(), 'compositePoLines', []);

    return lines.find(u => u.id === lineId);
  }

  createNewOrder = async () => {
    const { parentMutator } = this.props;
    const order = this.getOrder();

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
    const { parentMutator, location: { pathname } } = this.props;

    const materialSupplier = get(line, 'physical.materialSupplier');
    const accessProvider = get(line, 'eresource.accessProvider');

    if (materialSupplier === '') {
      line.physical.materialSupplier = null;
    }
    if (accessProvider === '') {
      line.eresource.accessProvider = null;
    }

    parentMutator.poLine.PUT(line)
      .then(() => {
        parentMutator.query.update({
          _path: `${pathname}`,
          layer: null,
        });
      })
      .catch(e => this.handleErrorResponse(e, line));
  }

  deletePOLine = (lineId) => {
    const { parentMutator, match: { params: { id } } } = this.props;

    parentMutator.poLine.DELETE({ id: lineId }).then(() => {
      parentMutator.query.update({
        _path: `/orders/view/${id}`,
        layer: null,
      });
    });
  }

  getCreatePOLIneInitialValues = (order) => {
    const { parentResources, resources } = this.props;
    const { id: orderId, vendor: vendorId } = order;
    const vendor = get(parentResources, 'vendors.records', []).find(d => d.id === vendorId);
    const createInventorySetting = getCreateInventorySetting(get(resources, ['createInventory', 'records'], []));

    const newObj = {
      source: {
        code: SOURCE_FOLIO_CODE,
      },
      cost: {
        currency: CURRENCY.usd,
      },
      vendorDetail: {
        instructions: '',
      },
      purchaseOrderId: orderId,
      eresource: {
        createInventory: createInventorySetting.eresource,
      },
      physical: {
        createInventory: createInventorySetting.physical,
      },
    };

    if (vendor && vendor.discount_percent) {
      newObj.cost.discountType = DISCOUNT_TYPE.percentage;
      newObj.cost.discount = vendor.discount_percent;
    }

    return newObj;
  }

  render() {
    const {
      location,
      onCancel,
      parentMutator,
      parentResources,
      stripes,
    } = this.props;
    const { layer } = location.search ? queryString.parse(location.search) : {};
    const order = this.getOrder();

    if (!order) {
      return null;
    } else if (layer === 'create-po-line') {
      return (
        <Layer
          isOpen
          contentLabel="Create PO Line Dialog"
        >
          <this.connectedPOLineForm
            initialValues={this.getCreatePOLIneInitialValues(order)}
            onCancel={onCancel}
            onSubmit={this.submitPOLine}
            order={order}
            parentMutator={parentMutator}
            parentResources={parentResources}
            stripes={stripes}
          />
          {this.state.isLinesLimitExceededModalOpened && (
            <LinesLimit
              cancel={this.closeLineLimitExceededModal}
              createOrder={this.createNewOrder}
            />
          )}
          <Callout ref={this.callout} />
        </Layer>
      );
    } else if (layer === 'edit-po-line') {
      return (
        <Layer
          isOpen
          contentLabel="Edit PO Line Dialog"
        >
          <this.connectedPOLineForm
            deletePOLine={this.deletePOLine}
            initialValues={this.getLine()}
            onCancel={onCancel}
            onSubmit={this.updatePOLine}
            order={order}
            parentMutator={parentMutator}
            parentResources={parentResources}
            stripes={stripes}
          />
          <Callout ref={this.callout} />
        </Layer>
      );
    }

    return null;
  }
}

export default LayerPOLine;
