import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  cloneDeep,
  get,
  set,
} from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { getFormValues } from 'redux-form';

import {
  CalloutContext,
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  LoadingView,
} from '@folio/stripes/components';
import {
  DICT_CONTRIBUTOR_NAME_TYPES,
  DICT_IDENTIFIER_TYPES,
  fundsManifest,
  getConfigSetting,
  locationsManifest,
  materialTypesManifest,
  sourceValues,
  VENDORS_API,
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
  APPROVALS_SETTING,
  CONTRIBUTOR_NAME_TYPES,
  CREATE_INVENTORY,
  IDENTIFIER_TYPES,
  OPEN_ORDER_SETTING,
  ORDER_LINES,
  ORDER_TEMPLATES,
  ORDER,
  VALIDATE_ISBN,
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
  static contextType = CalloutContext;
  static manifest = Object.freeze({
    order: ORDER,
    openOrderSetting: OPEN_ORDER_SETTING,
    approvalsSetting: APPROVALS_SETTING,
    [DICT_CONTRIBUTOR_NAME_TYPES]: CONTRIBUTOR_NAME_TYPES,
    poLines: ORDER_LINES,
    vendors: {
      type: 'okapi',
      path: VENDORS_API,
      GET: {
        params: {
          query: 'id=="*" sortby name',
        },
      },
      records: 'organizations',
      perRequest: 1000,
    },
    createInventory: CREATE_INVENTORY,
    orderTemplates: ORDER_TEMPLATES,
    locations: {
      ...locationsManifest,
      accumulate: false,
      fetch: true,
    },
    fund: fundsManifest,
    materialTypes: {
      ...materialTypesManifest,
      accumulate: false,
      fetch: true,
    },
    validateISBN: VALIDATE_ISBN,
    [DICT_IDENTIFIER_TYPES]: IDENTIFIER_TYPES,
    query: {},
  });

  constructor(props) {
    super(props);

    this.state = {
      isLinesLimitExceededModalOpened: false,
      line: null,
    };
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

        this.context.sendCallout({
          message: <SafeHTMLMessage id={`ui-orders.errors.${messageCode}`} />,
          type: 'error',
        });
      }
    } else {
      this.context.sendCallout({
        message: <SafeHTMLMessage id="ui-orders.errors.orderLineGenericError" />,
        type: 'error',
      });
    }
  };

  submitPOLine = ({ saveAndOpen, ...line }) => {
    const newLine = cloneDeep(line);
    const { history, location, match: { params: { id } }, mutator: { poLines } } = this.props;

    delete newLine.template;

    poLines.POST(newLine)
      .then(() => this.openOrder(saveAndOpen))
      .then(() => {
        this.context.sendCallout({
          message: <SafeHTMLMessage id="ui-orders.line.create.success" />,
          type: 'success',
        });
        history.push({
          pathname: `/orders/view/${id}`,
          search: location.search,
        });
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
    const { mutator } = this.props;
    const { line } = this.state;
    const order = this.getOrder();

    try {
      const newOrder = await cloneOrder(order, mutator.order, line && [line]);

      mutator.query.update({
        _path: `/orders/view/${newOrder.id}`,
        layer: null,
      });
    } catch (e) {
      this.context.sendCallout({
        message: <FormattedMessage id="ui-orders.errors.noCreatedOrder" />,
        type: 'error',
      });
    } finally {
      this.closeLineLimitExceededModal();
    }
  };

  openOrder = (saveAndOpen) => {
    const { mutator } = this.props;
    const order = this.getOrder();

    return saveAndOpen
      ? updateOrderResource(order, mutator.order, { workflowStatus: WORKFLOW_STATUS.open })
        .then(() => {
          this.context.sendCallout({
            message: <SafeHTMLMessage id="ui-orders.order.open.success" values={{ orderNumber: order.poNumber }} />,
            type: 'success',
          });
        })
        .catch(() => {
          this.context.sendCallout({
            message: <SafeHTMLMessage id="ui-orders.errors.openOrder" values={{ orderNumber: order.poNumber }} />,
            type: 'error',
          });
        })
      : Promise.resolve();
  }

  updatePOLine = ({ saveAndOpen, ...data }) => {
    const line = cloneDeep(data);

    delete line.metadata;
    const { mutator } = this.props;

    return mutator.poLines.PUT(line)
      .then(() => this.openOrder(saveAndOpen))
      .then(() => {
        this.context.sendCallout({
          message: <SafeHTMLMessage id="ui-orders.line.update.success" values={{ lineNumber: line.poLineNumber }} />,
          type: 'success',
        });
        setTimeout(this.onCancel);
      })
      .catch(e => this.handleErrorResponse(e, line));
  };

  getCreatePOLIneInitialValues = (order, vendor) => {
    const { resources, stripes } = this.props;
    const { id: orderId } = order;
    const createInventorySetting = getCreateInventorySetting(get(resources, ['createInventory', 'records'], []));

    const newObj = {
      template: get(order, 'template', ''),
      source: sourceValues.user,
      cost: {
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
    const templateValue = getOrderTemplateValue(resources, order.template);

    const { form } = stripes.store.getState();

    Object.keys(get(form, 'POLineForm.registeredFields', {}))
      .forEach(field => {
        const templateField = POL_TEMPLATE_FIELDS_MAP[field] || field;
        const templateFieldValue = get(templateValue, templateField);

        if (templateFieldValue !== undefined) set(newObj, field, templateFieldValue);
      });
    set(newObj, 'cost.currency', newObj?.cost?.currency || stripes.currency);

    return newObj;
  };

  onCancel = () => {
    const { match: { params: { id, lineId } }, history, location } = this.props;

    history.push({
      pathname: `/orders/view/${id}/po-line/view/${lineId}`,
      search: location.search,
    });
  };

  render() {
    const {
      match,
      mutator,
      resources,
      stripes,
    } = this.props;
    const onCancel = this.onCancel;
    const { params: { id, lineId } } = match;
    const order = this.getOrder();
    const { vendor: vendorId } = order || {};
    const vendor = get(resources, 'vendors.records', []).find(d => d.id === vendorId);
    const { isOpenOrderEnabled } = getConfigSetting(get(resources, 'openOrderSetting.records', {}));
    const { isApprovalRequired } = getConfigSetting(get(resources, 'approvalsSetting.records', {}));
    const isOrderApproved = isApprovalRequired ? get(order, 'approved') : true;
    const isSaveAndOpenButtonVisible = isOpenOrderEnabled
      && isOrderApproved
      && get(order, 'workflowStatus') === WORKFLOW_STATUS.pending;
    const isLoading = !(
      get(resources, 'createInventory.hasLoaded') &&
      get(resources, 'order.hasLoaded') &&
      get(resources, 'openOrderSetting.hasLoaded') &&
      get(resources, 'approvalsSetting.hasLoaded') &&
      get(resources, `${DICT_CONTRIBUTOR_NAME_TYPES}.hasLoaded`) &&
      get(resources, 'vendors.hasLoaded') &&
      get(resources, 'orderTemplates.hasLoaded') &&
      get(resources, 'locations.hasLoaded') &&
      get(resources, `${DICT_IDENTIFIER_TYPES}.hasLoaded`) &&
      get(resources, 'materialTypes.hasLoaded') &&
      get(resources, 'fund.hasLoaded') &&
      get(order, 'id') === id
    );

    const formValues = getFormValues('POLineForm')(stripes.store.getState());

    if (isLoading) {
      return <LoadingView defaultWidth="fill" onClose={onCancel} />;
    } else if (!lineId) {
      return (
        <>
          <POLineForm
            initialValues={this.getCreatePOLIneInitialValues(order, vendor)}
            onCancel={onCancel}
            onSubmit={this.submitPOLine}
            order={order}
            vendor={vendor}
            parentMutator={mutator}
            parentResources={resources}
            stripes={stripes}
            isSaveAndOpenButtonVisible={isSaveAndOpenButtonVisible}
            formValues={formValues}
          />
          {this.state.isLinesLimitExceededModalOpened && (
            <LinesLimit
              cancel={this.closeLineLimitExceededModal}
              createOrder={this.createNewOrder}
            />
          )}
        </>
      );
    } else {
      return (
        <>
          <POLineForm
            initialValues={this.getLine()}
            onCancel={onCancel}
            onSubmit={this.updatePOLine}
            order={order}
            vendor={vendor}
            parentMutator={mutator}
            parentResources={resources}
            stripes={stripes}
            isSaveAndOpenButtonVisible={isSaveAndOpenButtonVisible}
            formValues={formValues}
          />
        </>
      );
    }
  }
}

LayerPOLine.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(LayerPOLine);
