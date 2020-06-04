import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  LoadingView,
} from '@folio/stripes/components';
import {
  baseManifest,
  DICT_CONTRIBUTOR_NAME_TYPES,
  DICT_IDENTIFIER_TYPES,
  getConfigSetting,
  locationsManifest,
  materialTypesManifest,
  sourceValues,
  useModalToggle,
  useShowCallout,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  ERROR_CODES,
  WORKFLOW_STATUS,
} from '../../common/constants';
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
import ModalDeletePieces from '../ModalDeletePieces';

function LayerPOLine({
  history,
  location: { search },
  match: { params: { id, lineId } },
  mutator,
  resources,
  stripes,
}) {
  const [isLinesLimitExceededModalOpened, setLinesLimitExceededModalOpened] = useState(false);
  const [isDeletePiecesOpened, toggleDeletePieces] = useModalToggle();
  const [savingValues, setSavingValues] = useState();
  const sendCallout = useShowCallout();
  const [isLoading, setIsLoading] = useState(false);
  const order = get(resources, 'lineOrder.records.0');
  const createInventory = get(resources, ['createInventory', 'records']);
  const createInventorySetting = useMemo(
    () => getCreateInventorySetting(createInventory),
    [createInventory],
  );
  const poLine = get(order, 'compositePoLines', []).find((u) => u.id === lineId);
  const [vendor, setVendor] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedMutator = useMemo(() => mutator, []);

  const openLineLimitExceededModal = useCallback(line => {
    setLinesLimitExceededModalOpened(true);
    setSavingValues(line);
  }, []);

  const closeLineLimitExceededModal = useCallback(() => {
    setLinesLimitExceededModalOpened(false);
    setSavingValues();
  }, []);

  const handleErrorResponse = useCallback(
    async (e, line) => {
      let response;

      try {
        response = await e.json();
      } catch (parsingException) {
        response = e;
      }

      if (response.errors && response.errors.length) {
        if (response.errors.find(el => el.code === 'lines_limit')) {
          openLineLimitExceededModal(line);
        } else if (response.errors.find(el => el.code === ERROR_CODES.piecesNeedToBeDeleted)) {
          toggleDeletePieces();
        } else {
          const messageCode = get(ERROR_CODES, response.errors[0].code, 'orderLineGenericError');

          sendCallout({
            message: <SafeHTMLMessage id={`ui-orders.errors.${messageCode}`} />,
            type: 'error',
          });
        }
      } else {
        sendCallout({
          message: <SafeHTMLMessage id="ui-orders.errors.orderLineGenericError" />,
          type: 'error',
        });
      }
    },
    [openLineLimitExceededModal, sendCallout, toggleDeletePieces],
  );

  const openOrder = useCallback(
    (saveAndOpen, poLineId) => {
      return saveAndOpen
        ? updateOrderResource(order, memoizedMutator.lineOrder, {
          workflowStatus: WORKFLOW_STATUS.open,
        })
          .then(() => {
            sendCallout({
              message: (
                <SafeHTMLMessage
                  id="ui-orders.order.open.success"
                  values={{ orderNumber: order.poNumber }}
                />
              ),
              type: 'success',
            });
          })
          .catch(() => {
            sendCallout({
              message: (
                <SafeHTMLMessage
                  id="ui-orders.errors.openOrder"
                  values={{ orderNumber: order.poNumber }}
                />
              ),
              type: 'error',
            });
          })
        : Promise.resolve(poLineId);
    },
    [memoizedMutator.lineOrder, order, sendCallout],
  );

  const submitPOLine = useCallback(({ saveAndOpen, ...line }) => {
    setSavingValues(line);
    setIsLoading(true);
    const newLine = cloneDeep(line);

    return memoizedMutator.poLines
      .POST(newLine)
      .then(({ id: poLineId }) => openOrder(saveAndOpen, poLineId))
      .then(lineIdResponse => {
        sendCallout({
          message: <SafeHTMLMessage id="ui-orders.line.create.success" />,
          type: 'success',
        });

        const pathname = lineIdResponse
          ? `/orders/view/${id}/po-line/view/${lineIdResponse}`
          : `/orders/view/${id}`;

        history.push({
          pathname,
          search,
        });
      })
      .catch((e) => {
        setIsLoading(false);
        handleErrorResponse(e, line);
      });
  }, [handleErrorResponse, history, id, search, memoizedMutator.poLines, openOrder, sendCallout]);

  const createNewOrder = useCallback(
    async () => {
      closeLineLimitExceededModal();
      setIsLoading(true);

      try {
        const newOrder = await cloneOrder(
          order,
          memoizedMutator.lineOrder,
          savingValues && [savingValues],
        );

        history.push({
          pathname: `/orders/view/${newOrder.id}`,
          search,
        });
      } catch (e) {
        setIsLoading(false);
        sendCallout({
          message: <FormattedMessage id="ui-orders.errors.noCreatedOrder" />,
          type: 'error',
        });
      }
    },
    [closeLineLimitExceededModal, history, savingValues, search, memoizedMutator.lineOrder, order, sendCallout],
  );

  const onCancel = useCallback(() => {
    const pathname = lineId
      ? `/orders/view/${id}/po-line/view/${lineId}`
      : `/orders/view/${id}`;

    history.push({
      pathname,
      search,
    });
  }, [history, id, lineId, search]);

  const updatePOLine = useCallback(({ saveAndOpen, ...data }) => {
    setSavingValues(data);
    setIsLoading(true);
    const line = cloneDeep(data);

    delete line.metadata;

    return memoizedMutator.poLines
      .PUT(line)
      .then(() => openOrder(saveAndOpen))
      .then(() => {
        sendCallout({
          message: (
            <SafeHTMLMessage
              id="ui-orders.line.update.success"
              values={{ lineNumber: line.poLineNumber }}
            />
          ),
          type: 'success',
        });
        setTimeout(onCancel);
      })
      .catch((e) => {
        setIsLoading(false);
        handleErrorResponse(e, line);
      });
  }, [handleErrorResponse, memoizedMutator.poLines, onCancel, openOrder, sendCallout]);

  const getCreatePOLIneInitialValues = () => {
    const orderId = order?.id;
    const newObj = {
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
    const templateValue = getOrderTemplateValue(resources, order?.template);

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

  const vendorId = order?.vendor;

  useEffect(
    () => {
      if (vendorId) memoizedMutator.orderVendor.GET({ path: `${VENDORS_API}/${vendorId}` }).then(setVendor);
    },
    [memoizedMutator.orderVendor, vendorId],
  );

  const { isOpenOrderEnabled } = getConfigSetting(
    get(resources, 'openOrderSetting.records', {}),
  );
  const { isApprovalRequired } = getConfigSetting(
    get(resources, 'approvalsSetting.records', {}),
  );
  const isOrderApproved = isApprovalRequired ? get(order, 'approved') : true;
  const isSaveAndOpenButtonVisible =
    isOpenOrderEnabled &&
    isOrderApproved &&
    get(order, 'workflowStatus') === WORKFLOW_STATUS.pending;
  const isntLoaded = !(
    get(resources, 'createInventory.hasLoaded') &&
    get(resources, 'lineOrder.hasLoaded') &&
    get(resources, 'openOrderSetting.hasLoaded') &&
    get(resources, 'approvalsSetting.hasLoaded') &&
    get(resources, `${DICT_CONTRIBUTOR_NAME_TYPES}.hasLoaded`) &&
    vendor &&
    get(resources, 'orderTemplates.hasLoaded') &&
    get(resources, 'locations.hasLoaded') &&
    get(resources, `${DICT_IDENTIFIER_TYPES}.hasLoaded`) &&
    get(resources, 'materialTypes.hasLoaded') &&
    get(order, 'id') === id
  );

  if (isLoading || isntLoaded) return <LoadingView dismissible onClose={onCancel} />;

  const formValues = getFormValues('POLineForm')(stripes.store.getState());
  const initialValues = lineId ? poLine : getCreatePOLIneInitialValues();
  const onSubmit = lineId ? updatePOLine : submitPOLine;

  return (
    <>
      <POLineForm
        initialValues={savingValues || initialValues}
        onCancel={onCancel}
        onSubmit={onSubmit}
        order={order}
        vendor={vendor}
        parentMutator={mutator} // required for async validation, `validateISBN`
        parentResources={resources}
        stripes={stripes}
        isSaveAndOpenButtonVisible={isSaveAndOpenButtonVisible}
        formValues={formValues} // hack to re-render redux-form
        enableSaveBtn={Boolean(savingValues)}
      />
      {isLinesLimitExceededModalOpened && (
        <LinesLimit
          cancel={closeLineLimitExceededModal}
          createOrder={createNewOrder}
        />
      )}
      {isDeletePiecesOpened && (
        <ModalDeletePieces
          onCancel={toggleDeletePieces}
          poLines={order?.compositePoLines}
        />
      )}
    </>
  );
}

LayerPOLine.manifest = Object.freeze({
  lineOrder: ORDER,
  openOrderSetting: OPEN_ORDER_SETTING,
  approvalsSetting: APPROVALS_SETTING,
  [DICT_CONTRIBUTOR_NAME_TYPES]: CONTRIBUTOR_NAME_TYPES,
  poLines: ORDER_LINES,
  orderVendor: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  createInventory: CREATE_INVENTORY,
  orderTemplates: ORDER_TEMPLATES,
  locations: {
    ...locationsManifest,
    accumulate: false,
    fetch: true,
  },
  materialTypes: {
    ...materialTypesManifest,
    accumulate: false,
    fetch: true,
  },
  validateISBN: VALIDATE_ISBN,
  [DICT_IDENTIFIER_TYPES]: IDENTIFIER_TYPES,
});

LayerPOLine.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(LayerPOLine);
