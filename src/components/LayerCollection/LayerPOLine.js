import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  cloneDeep,
  get,
  set,
} from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';

import { stripesShape } from '@folio/stripes/core';
import {
  Layer,
} from '@folio/stripes/components';
import {
  getConfigSetting,
  LoadingPane,
  sourceValues,
} from '@folio/stripes-acq-components';

import { WORKFLOW_STATUS } from '../../common/constants';
import getCreateInventorySetting from '../../common/utils/getCreateInventorySetting';
import {
  DISCOUNT_TYPE,
  POL_TEMPLATE_FIELDS_MAP,
} from '../POLine/const';
import {
  cloneOrder,
  updateOrderResource,
} from '../Utils/orderResource';
import {
  lineMutatorShape,
  orderRecordsMutatorShape,
} from '../Utils/mutators';
import {
  APPROVALS_SETTING,
  OPEN_ORDER_SETTING,
  ORDER,
} from '../Utils/resources';
import { POLineForm } from '../POLine';
import LinesLimit from '../PurchaseOrder/LinesLimit';
import getOrderTemplateValue from '../Utils/getOrderTemplateValue';

const ERROR_CODES = {
  accessProviderIsInactive: 'accessProviderIsInactive',
  accessProviderNotFound: 'accessProviderNotFound',
  costAdditionalCostInvalid: 'costAdditionalCostInvalid',
  costDiscountInvalid: 'costDiscountInvalid',
  costQtyPhysicalExceedsLoc: 'costQtyPhysicalExceedsLoc',
  costUnitPriceElectronicInvalid: 'costUnitPriceElectronicInvalid',
  costUnitPriceInvalid: 'costUnitPriceInvalid',
  electronicLocCostQtyMismatch: 'electronicLocCostQtyMismatch',
  fundsNotFound: 'fundsNotFound',
  invalidISBN: 'invalidISBN',
  locNotProvided: 'locNotProvided',
  locQtyElectronicExceedsCost: 'locQtyElectronicExceedsCost',
  locQtyPhysicalExceedsCost: 'locQtyPhysicalExceedsCost',
  materialTypeRequired: 'materialTypeRequired',
  missingContributorNameType: 'missingContributorNameType',
  nonZeroCostQtyElectronic: 'nonZeroCostQtyElectronic',
  nonZeroCostQtyPhysical: 'nonZeroCostQtyPhysical',
  nonZeroLocQtyPhysical: 'nonZeroLocQtyPhysical',
  orderIdMismatch: 'orderIdMismatch',
  orderIdRequired: 'orderIdRequired',
  orderNotFound: 'orderNotFound',
  physicalLocCostQtyMismatch: 'physicalLocCostQtyMismatch',
  protectedFieldChanging: 'protectedFieldChanging',
  userHasNoAcqUnitsPermission: 'userHasNoAcqUnitsPermission',
  userHasNoPermission: 'userHasNoPermission',
  zeroCostQty: 'zeroCostQty',
  zeroCostQtyElectronic: 'zeroCostQtyElectronic',
  zeroCostQtyPhysical: 'zeroCostQtyPhysical',
  zeroLocQty: 'zeroLocQty',
};

class LayerPOLine extends Component {
  static manifest = Object.freeze({
    order: ORDER,
    openOrderSetting: OPEN_ORDER_SETTING,
    approvalsSetting: APPROVALS_SETTING,
  });

  constructor(props) {
    super(props);

    this.state = {
      isLinesLimitExceededModalOpened: false,
      line: null,
    };
    this.connectedPOLineForm = props.stripes.connect(POLineForm);
  }

  openLineLimitExceededModal = (line) => {
    this.setState({
      isLinesLimitExceededModalOpened: true,
      line,
    });
  };

  closeLineLimitExceededModal = () => {
    this.setState({
      isLinesLimitExceededModalOpened: false,
      line: null,
    });
  };

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
        const messageCode = get(ERROR_CODES, response.errors[0].code, 'orderLineGenericError');

        this.props.showToast(`ui-orders.errors.${messageCode}`, 'error');
      }
    } else {
      this.props.showToast('ui-orders.errors.orderLineGenericError', 'error');
    }
  };

  submitPOLine = ({ saveAndOpen, ...line }) => {
    const newLine = cloneDeep(line);
    const { parentMutator: { poLine }, onCancel, showToast } = this.props;

    delete newLine.template;

    poLine.POST(newLine)
      .then(() => this.openOrder(saveAndOpen))
      .then(() => {
        showToast('ui-orders.line.create.success', 'success');
        onCancel();
      })
      .catch(e => this.handleErrorResponse(e, line));
  };

  getOrder = () => get(this.props, 'resources.order.records.0');

  getLine = () => {
    const { match: { params: { lineId } } } = this.props;
    const lines = get(this.getOrder(), 'compositePoLines', []);

    return lines.find(u => u.id === lineId);
  };

  createNewOrder = async () => {
    const { parentMutator } = this.props;
    const { line } = this.state;
    const order = this.getOrder();

    try {
      const newOrder = await cloneOrder(order, parentMutator.records, line && [line]);

      parentMutator.query.update({
        _path: `/orders/view/${newOrder.id}`,
        layer: null,
      });
    } catch (e) {
      this.callout.current.sendCallout({
        message: <FormattedMessage id="ui-orders.errors.noCreatedOrder" />,
        type: 'error',
      });
    } finally {
      this.closeLineLimitExceededModal();
    }
  };

  openOrder = (saveAndOpen) => {
    const { mutator, showToast } = this.props;
    const order = this.getOrder();

    return saveAndOpen
      ? updateOrderResource(order, mutator.order, { workflowStatus: WORKFLOW_STATUS.open })
        .then(() => {
          showToast('ui-orders.order.open.success', 'success', { orderNumber: order.poNumber });
        })
        .catch(() => {
          showToast('ui-orders.errors.openOrder', 'error', { orderNumber: order.poNumber });
        })
      : Promise.resolve();
  }

  updatePOLine = ({ saveAndOpen, ...data }) => {
    const line = cloneDeep(data);

    delete line.metadata;
    const { location: { pathname }, parentMutator, showToast } = this.props;

    return parentMutator.poLine.PUT(line)
      .then(() => this.openOrder(saveAndOpen))
      .then(() => {
        showToast('ui-orders.line.update.success', 'success', { lineNumber: line.poLineNumber });
        setTimeout(() => {
          parentMutator.query.update({
            _path: `${pathname}`,
            layer: null,
          });
        });
      })
      .catch(e => this.handleErrorResponse(e, line));
  };

  getCreatePOLIneInitialValues = (order, vendor) => {
    const { parentResources, stripes } = this.props;
    const { id: orderId } = order;
    const createInventorySetting = getCreateInventorySetting(get(parentResources, ['createInventory', 'records'], []));

    const newObj = {
      template: get(order, 'template', ''),
      source: sourceValues.user,
      cost: {
        currency: stripes.currency,
      },
      vendorDetail: {
        instructions: '',
        vendorAccount: get(vendor, 'accounts[0].accountNo', ''),
      },
      details: {
        subscriptionInterval: get(vendor, 'subscriptionInterval'),
      },
      purchaseOrderId: orderId,
      eresource: {
        createInventory: createInventorySetting.eresource,
      },
      physical: {
        createInventory: createInventorySetting.physical,
      },
      locations: [],
      isPackage: false,
    };

    if (vendor) {
      newObj.eresource.accessProvider = vendor.id;
      newObj.physical.materialSupplier = vendor.id;

      if (vendor.discountPercent) {
        newObj.cost.discountType = DISCOUNT_TYPE.percentage;
        newObj.cost.discount = vendor.discountPercent;
      }
    }
    const templateValue = getOrderTemplateValue(parentResources, order.template);

    const { form } = stripes.store.getState();

    Object.keys(get(form, 'POLineForm.registeredFields', {}))
      .forEach(field => {
        const templateField = POL_TEMPLATE_FIELDS_MAP[field] || field;
        const templateFieldValue = get(templateValue, templateField);

        if (templateFieldValue !== undefined) set(newObj, field, templateFieldValue);
      });

    return newObj;
  };

  render() {
    const {
      connectedSource,
      location,
      match,
      onCancel,
      parentMutator,
      parentResources,
      resources,
      stripes,
    } = this.props;
    const { params: { id } } = match;
    const { layer } = location.search ? queryString.parse(location.search) : {};
    const order = this.getOrder();
    const { vendor: vendorId } = order || {};
    const vendor = get(parentResources, 'vendors.records', []).find(d => d.id === vendorId);
    const { isOpenOrderEnabled } = getConfigSetting(get(resources, 'openOrderSetting.records', {}));
    const { isApprovalRequired } = getConfigSetting(get(resources, 'approvalsSetting.records', {}));
    const isOrderApproved = isApprovalRequired ? get(order, 'approved') : true;
    const isSaveAndOpenButtonVisible = isOpenOrderEnabled
      && isOrderApproved
      && get(order, 'workflowStatus') === WORKFLOW_STATUS.pending;
    const isLoading = !(
      get(parentResources, 'createInventory.hasLoaded') &&
      get(resources, 'order.hasLoaded') &&
      get(resources, 'openOrderSetting.hasLoaded') &&
      get(resources, 'approvalsSetting.hasLoaded') &&
      get(order, 'id') === id
    );

    if (isLoading) {
      return <LoadingPane onClose={onCancel} />;
    } else if (layer === 'create-po-line') {
      return (
        <Layer
          isOpen
          contentLabel="Create PO Line Dialog"
        >
          <this.connectedPOLineForm
            connectedSource={connectedSource}
            initialValues={this.getCreatePOLIneInitialValues(order, vendor)}
            onCancel={onCancel}
            onSubmit={this.submitPOLine}
            order={order}
            vendor={vendor}
            parentMutator={parentMutator}
            parentResources={parentResources}
            stripes={stripes}
            isSaveAndOpenButtonVisible={isSaveAndOpenButtonVisible}
          />
          {this.state.isLinesLimitExceededModalOpened && (
            <LinesLimit
              cancel={this.closeLineLimitExceededModal}
              createOrder={this.createNewOrder}
            />
          )}
        </Layer>
      );
    } else if (layer === 'edit-po-line') {
      return (
        <Layer
          isOpen
          contentLabel="Edit PO Line Dialog"
        >
          <this.connectedPOLineForm
            connectedSource={connectedSource}
            initialValues={this.getLine()}
            onCancel={onCancel}
            onSubmit={this.updatePOLine}
            order={order}
            vendor={vendor}
            parentMutator={parentMutator}
            parentResources={parentResources}
            stripes={stripes}
            isSaveAndOpenButtonVisible={isSaveAndOpenButtonVisible}
          />
        </Layer>
      );
    }

    return null;
  }
}

LayerPOLine.propTypes = {
  connectedSource: PropTypes.object.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match,
  parentMutator: PropTypes.shape({
    poLine: lineMutatorShape,
    records: orderRecordsMutatorShape,
    query: PropTypes.object.isRequired,
  }),
  parentResources: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  showToast: PropTypes.func.isRequired,
  stripes: stripesShape.isRequired,
  onCancel: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default LayerPOLine;
