import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import omit from 'lodash/omit';
import set from 'lodash/set';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  ErrorModal,
  LoadingView,
} from '@folio/stripes/components';
import { useCustomFields } from '@folio/stripes/smart-components';
import {
  CUSTOM_FIELDS_ORDERS_BACKEND_NAME,
  DICT_CONTRIBUTOR_NAME_TYPES,
  DICT_IDENTIFIER_TYPES,
  getConfigSetting,
  LIMIT_MAX,
  materialTypesManifest,
  ORDER_FORMATS,
  ResponseErrorsContainer,
  sourceValues,
  useCentralOrderingContext,
  useFunds,
  useIntegrationConfigs,
  useLocationsQuery,
  useModalToggle,
  useOrganization,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  ENTITY_TYPE_PO_LINE,
  ERROR_CODES,
  PO_LINE_FORM_FIELD_ARRAYS_TO_HYDRATE,
  SUBMIT_ACTION_FIELD,
  VALIDATION_ERRORS,
  WORKFLOW_STATUS,
} from '../../common/constants';
import {
  useInstance,
  useLinesLimit,
  useOpenOrderSettings,
  useOrder,
  useOrderLine,
  useOrderTemplate,
  useTitleMutation,
} from '../../common/hooks';
import {
  getCreateInventorySetting,
  getExportAccountNumbers,
  validateDuplicateLines,
} from '../../common/utils';
import DuplicateLinesModal from '../../common/DuplicateLinesModal';
import {
  DISCOUNT_TYPE,
  POL_TEMPLATE_FIELDS_LIST,
  POL_TEMPLATE_FIELDS_MAP,
  SUBMIT_ACTION,
} from '../POLine/const';
import {
  cloneOrder,
  updateOrderResource,
} from '../Utils/orderResource';
import {
  APPROVALS_SETTING,
  CONTRIBUTOR_NAME_TYPES,
  CONVERT_TO_ISBN13,
  CREATE_INVENTORY,
  IDENTIFIER_TYPES,
  ORDER_LINES,
  ORDER_NUMBER,
  ORDERS,
} from '../Utils/resources';
import { POLineForm } from '../POLine';
import LinesLimit from '../PurchaseOrder/LinesLimit';
import ModalDeletePieces from '../ModalDeletePieces';
import getOrderTemplateValue from '../Utils/getOrderTemplateValue';

const parseErrorMessage = (code) => {
  let messageCode;

  try {
    messageCode = JSON.parse(code)?.errors?.[0]?.code || 'orderLineGenericError';
  } catch {
    messageCode = 'orderLineGenericError';
  }

  return messageCode;
};

const handleVendorLoadingError = async (response, sendCallout) => {
  const { handler } = await ResponseErrorsContainer.create(response);

  sendCallout({
    message: <FormattedMessage id="ui-orders.error.fetching.vendor" />,
    type: 'error',
  });

  const message = handler.getError().message;

  if (message) {
    sendCallout({
      message: <FormattedMessage id={`ui-orders.${message}`} defaultMessage={message} />,
      type: 'error',
    });
  }
};

function LayerPOLine({
  history,
  location: { search, state: locationState },
  match: { params: { id, lineId } },
  mutator,
  resources,
  stripes,
}) {
  const intl = useIntl();
  const sendCallout = useShowCallout();
  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedMutator = useMemo(() => mutator, []);

  const [isDeletePiecesOpened, toggleDeletePieces] = useModalToggle();
  const [isNotUniqueOpen, toggleNotUnique] = useModalToggle();
  const [isDifferentAccountModalOpened, toggleDifferentAccountModal] = useModalToggle();

  const [isLinesLimitExceededModalOpened, setIsLinesLimitExceededModalOpened] = useState(false);
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [savingValues, setSavingValues] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isValidateDuplicateLines, setIsValidateDuplicateLines] = useState();
  const [duplicateLines, setDuplicateLines] = useState();

  const [poLines, setPoLines] = useState();

  const locationStateInstanceId = locationState?.instanceId;
  const isCreateFromInstance = Boolean(locationStateInstanceId);

  const { mutateTitle } = useTitleMutation();

  /* Queries */
  const {
    orderLine: poLine,
    isLoading: isOrderLineLoading,
    refetch,
  } = useOrderLine(lineId);

  const {
    isFetching: isOpenOrderSettingsFetching,
    openOrderSettings,
  } = useOpenOrderSettings();

  const {
    isLoading: isOrderLoading,
    order,
  } = useOrder(id);

  const {
    organization: vendor,
    isLoading: isVendorLoading,
  } = useOrganization(
    order?.vendor,
    { onError: ({ response }) => handleVendorLoadingError(response, sendCallout) },
  );

  const {
    instance,
    isLoading: isInstanceLoading,
  } = useInstance(locationStateInstanceId, { tenantId: locationState?.instanceTenantId });

  const {
    isLoading: isLinesLimitLoading,
    linesLimit,
  } = useLinesLimit(!(lineId || poLine));

  const {
    isFetching: isConfigsFetching,
    integrationConfigs,
  } = useIntegrationConfigs({ organizationId: vendor?.id });

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const {
    isFetching: isOrderTemplateFetching,
    orderTemplate: rawTemplate,
  } = useOrderTemplate(order?.template);

  const [
    customFields,
    isCustomFieldsLoading,
  ] = useCustomFields(CUSTOM_FIELDS_ORDERS_BACKEND_NAME, ENTITY_TYPE_PO_LINE);

  const {
    funds,
    isLoading: isFundsLoading,
  } = useFunds();
  /*  */

  const { isOpenOrderEnabled, isDuplicateCheckDisabled } = openOrderSettings;
  const { isApprovalRequired } = getConfigSetting(get(resources, 'approvalsSetting.records', {}));
  const createInventory = resources?.createInventory?.records;
  const isOrderApproved = isApprovalRequired ? order?.approved : true;
  const differentAccountsModalLabel = intl.formatMessage({ id: 'ui-orders.differentAccounts.title' });
  const createInventorySetting = useMemo(() => getCreateInventorySetting(createInventory), [createInventory]);

  const isSaveAndOpenButtonVisible = (
    isOpenOrderEnabled &&
    isOrderApproved &&
    order?.workflowStatus === WORKFLOW_STATUS.pending
  );

  useEffect(() => {
    setPoLines();
    memoizedMutator.poLines.GET({
      params: {
        query: `purchaseOrderId==${id}`,
        limit: LIMIT_MAX,
      },
    })
      .then(setPoLines);
  }, [id, memoizedMutator.poLines]);

  useEffect(() => {
    setIsValidateDuplicateLines(!isDuplicateCheckDisabled);
  }, [isDuplicateCheckDisabled]);

  const openLineLimitExceededModal = useCallback(line => {
    setIsLinesLimitExceededModalOpened(true);
    setSavingValues(line);
  }, []);

  const closeLineLimitExceededModal = useCallback(() => {
    setIsLinesLimitExceededModalOpened(false);
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

      if (response?.errors?.length) {
        if (response.errors.find(el => el.code === ERROR_CODES.polLimitExceeded)) {
          openLineLimitExceededModal(line);
        } else if (response.errors.find(el => el.code === ERROR_CODES.piecesNeedToBeDeleted)) {
          toggleDeletePieces();
        } else {
          let messageCode = get(ERROR_CODES, response.errors[0].code);

          if (!messageCode) {
            messageCode = parseErrorMessage(response.errors[0].message);
          }

          sendCallout({
            message: (
              <FormattedMessage
                id={`ui-orders.errors.${messageCode}`}
                defaultMessage={intl.formatMessage({ id: 'ui-orders.errors.orderLineGenericError' })}
              />
            ),
            type: 'error',
          });
        }
      } else {
        sendCallout({
          message: <FormattedMessage id="ui-orders.errors.orderLineGenericError" />,
          type: 'error',
        });
      }
    },
    [intl, openLineLimitExceededModal, sendCallout, toggleDeletePieces],
  );

  const openOrder = useCallback((newLine = {}) => {
    const exportAccountNumbers = getExportAccountNumbers([...order.poLines, newLine]);

    if (!order.manualPo && exportAccountNumbers.length > 1) {
      setAccountNumbers(exportAccountNumbers);

      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ validationError: VALIDATION_ERRORS.differentAccount });
    }

    return updateOrderResource(order, mutator.lineOrder, {
      workflowStatus: WORKFLOW_STATUS.open,
    })
      .then(() => {
        sendCallout({
          message: (
            <FormattedMessage
              id="ui-orders.order.open.success"
              values={{ orderNumber: order.poNumber }}
            />
          ),
          type: 'success',
        });
      })
      .catch(errorResponse => {
        sendCallout({
          message: (
            <FormattedMessage
              id="ui-orders.errors.openOrder"
              values={{ orderNumber: order.poNumber }}
            />
          ),
          type: 'error',
        });
        throw errorResponse;
      });
  }, [mutator.lineOrder, order, sendCallout]);

  const formatPOLineBeforeSaving = (line) => {
    switch (line.orderFormat) {
      case ORDER_FORMATS.electronicResource: return omit(line, 'physical');
      case ORDER_FORMATS.physicalResource:
      case ORDER_FORMATS.other: return omit(line, 'eresource');
      default: return line;
    }
  };

  const submitPOLine = useCallback(async (lineValues) => {
    const {
      [SUBMIT_ACTION_FIELD]: submitAction,
      isAcknowledged,
      ...line
    } = lineValues;

    let savedLine;

    setIsProcessing(true);
    setSavingValues(lineValues);

    try {
      if (isValidateDuplicateLines) {
        setIsValidateDuplicateLines(false);

        await validateDuplicateLines(line, mutator);
      }

      const newLine = formatPOLineBeforeSaving(cloneDeep(line));

      savedLine = await mutator.poLines.POST(newLine);

      let pathname = `/orders/view/${id}/po-line/view/${savedLine.id}`;

      switch (submitAction) {
        case SUBMIT_ACTION.saveAndOpen: {
          await openOrder(savedLine);

          if (isCreateFromInstance) {
            pathname = `/inventory/view/${locationStateInstanceId}`;
          }

          break;
        }
        case SUBMIT_ACTION.saveAndCreateAnother: {
          pathname = `/orders/view/${id}/po-line/create`;
          break;
        }
        case SUBMIT_ACTION.saveAndKeepEditing: {
          pathname = `/orders/view/${id}/po-line/edit/${savedLine.id}`;
          break;
        }
        case SUBMIT_ACTION.saveAndClose:
        default:
          if (isCreateFromInstance) {
            pathname = `/orders/view/${id}`;
          }

          break;
      }

      sendCallout({
        message: <FormattedMessage id="ui-orders.line.create.success" />,
        type: 'success',
      });

      setSavingValues();

      if (isAcknowledged) {
        try {
          await mutateTitle(savedLine.id);
        } catch {
          sendCallout({
            message: <FormattedMessage id="ui-orders.title.actions.update.error" />,
            type: 'error',
          });
        }
      }

      return history.push({
        pathname,
        search,
      });
    } catch (e) {
      if (e?.validationError === VALIDATION_ERRORS.duplicateLines) {
        setDuplicateLines(e.duplicateLines);

        return toggleNotUnique();
      }

      if (submitAction === SUBMIT_ACTION.saveAndOpen && savedLine) {
        await mutator.poLines.DELETE(savedLine);
      }

      if (e?.validationError === VALIDATION_ERRORS.differentAccount) {
        return toggleDifferentAccountModal();
      }

      return handleErrorResponse(e, line);
    } finally {
      setIsProcessing(false);
    }
  }, [
    isValidateDuplicateLines,
    mutator,
    isCreateFromInstance,
    id,
    sendCallout,
    history,
    search,
    openOrder,
    locationStateInstanceId,
    mutateTitle,
    handleErrorResponse,
    toggleNotUnique,
    toggleDifferentAccountModal,
  ]);

  const createNewOrder = useCallback(async () => {
    closeLineLimitExceededModal();
    setIsProcessing(true);

    try {
      const newOrder = await cloneOrder(
        order,
        mutator.lineOrder,
        memoizedMutator.orderNumber,
        savingValues && [savingValues],
      );

      history.push({
        pathname: `/orders/view/${newOrder.id}`,
        search,
      });
    } catch (e) {
      setIsProcessing(false);
      sendCallout({
        message: <FormattedMessage id="ui-orders.errors.noCreatedOrder" />,
        type: 'error',
      });
    }
  }, [
    closeLineLimitExceededModal,
    history,
    mutator.lineOrder,
    memoizedMutator.orderNumber,
    order,
    savingValues,
    search,
    sendCallout,
  ]);

  const onCancel = useCallback(() => {
    const pathname = lineId
      ? `/orders/view/${id}/po-line/view/${lineId}`
      : `/orders/view/${id}`;

    history.push({
      pathname: locationState?.backPathname || pathname,
      search,
    });
  }, [history, id, lineId, search, locationState]);

  const updatePOLine = useCallback(async (hydratedLine) => {
    const { [SUBMIT_ACTION_FIELD]: submitAction, ...data } = hydratedLine;

    setIsProcessing(true);
    setSavingValues(hydratedLine);

    if (isValidateDuplicateLines) {
      try {
        setIsValidateDuplicateLines(false);

        await validateDuplicateLines(hydratedLine, mutator);
      } catch (e) {
        if (e?.validationError === VALIDATION_ERRORS.duplicateLines) {
          setDuplicateLines(e.duplicateLines);

          setIsProcessing(false);

          return toggleNotUnique();
        }
      }
    }

    const line = formatPOLineBeforeSaving(cloneDeep(data));

    delete line.metadata;

    return mutator.poLines.PUT(line)
      .then(() => {
        sendCallout({
          message: (
            <FormattedMessage
              id="ui-orders.line.update.success"
              values={{ lineNumber: line.poLineNumber }}
            />
          ),
          type: 'success',
        });
      })
      .then(async () => {
        switch (submitAction) {
          case SUBMIT_ACTION.saveAndOpen: {
            await openOrder();
            onCancel();
            break;
          }
          case SUBMIT_ACTION.saveAndKeepEditing:
            await refetch();
            break;
          case SUBMIT_ACTION.saveAndClose:
          default:
            onCancel();
            break;
        }

        setIsProcessing(false);
      })
      .catch((e) => {
        setIsProcessing(false);

        if (e?.validationError === VALIDATION_ERRORS.differentAccount) {
          return toggleDifferentAccountModal();
        }

        return handleErrorResponse(e, line);
      });
  }, [
    isValidateDuplicateLines,
    mutator,
    toggleNotUnique,
    sendCallout,
    refetch,
    onCancel,
    openOrder,
    handleErrorResponse,
    toggleDifferentAccountModal,
  ]);

  const saveAfterDelete = useCallback(() => {
    updatePOLine(savingValues);
  }, [savingValues, updatePOLine]);

  const templateValue = useMemo(() => {
    return getOrderTemplateValue(rawTemplate, { locations });
  }, [locations, rawTemplate]);

  const essentialInitialValues = useMemo(() => ({
    purchaseOrderId: order?.id,
    source: sourceValues.user,
  }), [order?.id]);

  const buildInitialValuesWithoutTemplate = useCallback(() => {
    // Get the vendor's latest currency as default
    const vendorPreferredCurrency = vendor?.vendorCurrencies?.slice(-1)[0];

    const newObj = {
      ...essentialInitialValues,
      claimingActive: false,
      claimingInterval: vendor?.claimingInterval,
      cost: {
        currency: vendorPreferredCurrency || stripes.currency,
        discountType: DISCOUNT_TYPE.percentage,
      },
      vendorDetail: {
        instructions: '',
        vendorAccount: get(vendor, 'accounts[0].accountNo', ''),
      },
      details: {
        subscriptionInterval: get(vendor, 'subscriptionInterval'),
      },
      eresource: {
        createInventory: createInventorySetting.eresource,
      },
      physical: {
        createInventory: createInventorySetting.physical,
      },
      locations: [],
      isPackage: false,
      checkinItems: false,
      suppressInstanceFromDiscovery: instance?.discoverySuppress || false,
    };

    if (vendor?.id) {
      newObj.eresource.accessProvider = vendor.id;
      newObj.physical.materialSupplier = vendor.id;

      if (vendor?.discountPercent) {
        newObj.cost.discountType = DISCOUNT_TYPE.percentage;
        newObj.cost.discount = vendor.discountPercent;
      }
    }

    return newObj;
  }, [
    createInventorySetting.eresource,
    createInventorySetting.physical,
    essentialInitialValues,
    instance?.discoverySuppress,
    stripes.currency,
    vendor,
  ]);

  const buildInitialValuesBasedOnTemplate = useCallback((template) => {
    const fieldsToPopulate = Array.from(
      new Set([
        ...POL_TEMPLATE_FIELDS_LIST,
        ...(customFields || []).map(({ refId }) => `customFields.${refId}`),
      ]),
    );

    const initialValues = fieldsToPopulate.reduce((acc, field) => {
      const formFieldField = POL_TEMPLATE_FIELDS_MAP[field] || field;
      const templateFieldValue = get(template, field);

      if (templateFieldValue !== undefined) {
        set(acc, formFieldField, templateFieldValue);
      }

      return acc;
    }, { ...essentialInitialValues });

    return initialValues;
  }, [customFields, essentialInitialValues]);

  const getCreatePOLIneInitialValues = useMemo(() => {
    return templateValue?.id
      ? buildInitialValuesBasedOnTemplate(templateValue)
      : buildInitialValuesWithoutTemplate();
  }, [buildInitialValuesBasedOnTemplate, buildInitialValuesWithoutTemplate, templateValue]);

  const isntLoaded = !(
    get(resources, 'createInventory.hasLoaded') &&
    !isOrderLoading &&
    (!lineId || poLine) &&
    get(resources, 'approvalsSetting.hasLoaded') &&
    get(resources, `${DICT_CONTRIBUTOR_NAME_TYPES}.hasLoaded`) &&
    vendor &&
    get(resources, `${DICT_IDENTIFIER_TYPES}.hasLoaded`) &&
    get(resources, 'materialTypes.hasLoaded') &&
    get(order, 'id') === id &&
    !isOrderTemplateFetching &&
    !isLinesLimitLoading &&
    !isConfigsFetching &&
    !isOpenOrderSettingsFetching &&
    !isInstanceLoading &&
    !isLocationsLoading &&
    !isOrderLineLoading &&
    !isVendorLoading &&
    !isCustomFieldsLoading &&
    !isFundsLoading
  );

  if (isProcessing || isntLoaded) {
    return (
      <LoadingView
        dismissible
        onClose={onCancel}
      />
    );
  }

  const initialValues = lineId ? poLine : getCreatePOLIneInitialValues;
  const onSubmit = lineId ? updatePOLine : submitPOLine;

  return (
    <>
      <POLineForm
        centralOrdering={isCentralOrderingEnabled}
        enableSaveBtn={Boolean(savingValues)}
        fieldArraysToHydrate={PO_LINE_FORM_FIELD_ARRAYS_TO_HYDRATE}
        funds={funds}
        initialValues={savingValues || initialValues}
        instance={instance}
        integrationConfigs={integrationConfigs}
        isCreateFromInstance={isCreateFromInstance}
        isSaveAndOpenButtonVisible={isSaveAndOpenButtonVisible}
        linesLimit={linesLimit}
        locations={locations}
        onCancel={onCancel}
        onSubmit={onSubmit}
        order={order}
        parentResources={resources}
        stripes={stripes}
        templateValue={templateValue}
        vendor={vendor}
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
          onSubmit={saveAfterDelete}
          poLines={poLines}
        />
      )}

      {
        isNotUniqueOpen && (
          <DuplicateLinesModal
            duplicateLines={duplicateLines}
            onCancel={() => {
              toggleNotUnique();
              setIsValidateDuplicateLines(true);
            }}
            onSubmit={() => {
              toggleNotUnique();
              setIsValidateDuplicateLines(false);
              onSubmit(savingValues);
            }}
          />
        )
      }

      {isDifferentAccountModalOpened && (
        <ErrorModal
          aria-label={differentAccountsModalLabel}
          content={<FormattedMessage id="ui-orders.differentAccounts.message" values={{ accountNumber: accountNumbers.length }} />}
          id="order-open-different-account"
          label={differentAccountsModalLabel}
          onClose={() => (lineId ? onCancel() : toggleDifferentAccountModal())}
          open
        />
      )}
    </>
  );
}

LayerPOLine.manifest = Object.freeze({
  lineOrder: {
    ...ORDERS,
    accumulate: false,
    fetch: false,
  },
  approvalsSetting: APPROVALS_SETTING,
  [DICT_CONTRIBUTOR_NAME_TYPES]: CONTRIBUTOR_NAME_TYPES,
  poLines: ORDER_LINES,
  createInventory: CREATE_INVENTORY,
  materialTypes: {
    ...materialTypesManifest,
    accumulate: false,
    fetch: true,
  },
  convertToIsbn13: CONVERT_TO_ISBN13,
  [DICT_IDENTIFIER_TYPES]: IDENTIFIER_TYPES,
  orderNumber: ORDER_NUMBER,
});

LayerPOLine.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default stripesConnect(LayerPOLine);
