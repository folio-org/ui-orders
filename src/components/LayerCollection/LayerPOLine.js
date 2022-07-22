import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  cloneDeep,
  get,
  omit,
} from 'lodash';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  ErrorModal,
  LoadingView,
} from '@folio/stripes/components';
import {
  baseManifest,
  DICT_CONTRIBUTOR_NAME_TYPES,
  DICT_IDENTIFIER_TYPES,
  getConfigSetting,
  LIMIT_MAX,
  locationsManifest,
  materialTypesManifest,
  ORDER_FORMATS,
  sourceValues,
  useIntegrationConfigs,
  useModalToggle,
  useShowCallout,
  VENDORS_API,
} from '@folio/stripes-acq-components';

import {
  ERROR_CODES,
  WORKFLOW_STATUS,
  VALIDATION_ERRORS,
} from '../../common/constants';
import {
  useInstance,
  useLinesLimit,
  useOpenOrderSettings,
  useOrder,
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
  ORDER_TEMPLATES,
  ORDERS,
  VALIDATE_ISBN,
} from '../Utils/resources';
import { POLineForm } from '../POLine';
import LinesLimit from '../PurchaseOrder/LinesLimit';
import ModalDeletePieces from '../ModalDeletePieces';

const parseErrorMessage = (code) => {
  let messageCode;

  try {
    messageCode = JSON.parse(code)?.errors?.[0]?.code || 'orderLineGenericError';
  } catch {
    messageCode = 'orderLineGenericError';
  }

  return messageCode;
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
  const [isLinesLimitExceededModalOpened, setLinesLimitExceededModalOpened] = useState(false);
  const [isDeletePiecesOpened, toggleDeletePieces] = useModalToggle();
  const [isNotUniqueOpen, toggleNotUnique] = useModalToggle();
  const [isDifferentAccountModalOpened, toggleDifferentAccountModal] = useModalToggle();
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [savingValues, setSavingValues] = useState();
  const sendCallout = useShowCallout();
  const [isLoading, setIsLoading] = useState(false);
  const { isFetching: isOpenOrderSettingsFetching, openOrderSettings } = useOpenOrderSettings();
  const { isOpenOrderEnabled, isDuplicateCheckDisabled } = openOrderSettings;
  const [isValidateDuplicateLines, setValidateDuplicateLines] = useState();
  const [duplicateLines, setDuplicateLines] = useState();
  const { isLoading: isOrderLoading, order } = useOrder(id);
  const createInventory = get(resources, ['createInventory', 'records']);
  const createInventorySetting = useMemo(
    () => getCreateInventorySetting(createInventory),
    [createInventory],
  );
  const [poLines, setPoLines] = useState();
  const poLine = poLines?.find((u) => u.id === lineId);
  const [vendor, setVendor] = useState();
  const { isLoading: isLinesLimitLoading, linesLimit } = useLinesLimit(!(lineId || poLine));
  const [isCreateAnotherChecked, setCreateAnotherChecked] = useState(locationState?.isCreateAnotherChecked);
  const { isFetching: isConfigsFetching, integrationConfigs } = useIntegrationConfigs({ organizationId: vendor?.id });
  const { instance, isLoading: isInstanceLoading } = useInstance(locationState?.instanceId);
  const { mutateTitle } = useTitleMutation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedMutator = useMemo(() => mutator, []);

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
    setValidateDuplicateLines(!isDuplicateCheckDisabled);
  }, [isDuplicateCheckDisabled]);

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
    [openLineLimitExceededModal, sendCallout, toggleDeletePieces],
  );

  const openOrder = useCallback(
    (saveAndOpen, newLine = {}) => {
      if (saveAndOpen) {
        const exportAccountNumbers = getExportAccountNumbers([...order.compositePoLines, newLine]);

        if (!order.manualPo && exportAccountNumbers.length > 1) {
          setAccountNumbers(exportAccountNumbers);

          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({ validationError: VALIDATION_ERRORS.differentAccount });
        }

        return updateOrderResource(order, memoizedMutator.lineOrder, {
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
      } else return Promise.resolve();
    },
    [memoizedMutator.lineOrder, order, sendCallout],
  );

  const formatPOLineBeforeSaving = (line) => {
    switch (line.orderFormat) {
      case ORDER_FORMATS.electronicResource: return omit(line, 'physical');
      case ORDER_FORMATS.physicalResource:
      case ORDER_FORMATS.other: return omit(line, 'eresource');
      default: return line;
    }
  };

  const submitPOLine = useCallback(async (lineValues) => {
    const { saveAndOpen, isAcknowledged, ...line } = lineValues;
    let savedLine;

    setIsLoading(true);

    setSavingValues(lineValues);
    try {
      setIsLoading(true);

      if (isValidateDuplicateLines) {
        setValidateDuplicateLines(false);

        await validateDuplicateLines(line, mutator, resources);
      }

      const newLine = formatPOLineBeforeSaving(cloneDeep(line));

      savedLine = await memoizedMutator.poLines.POST(newLine);

      await openOrder(saveAndOpen, savedLine);

      sendCallout({
        message: <FormattedMessage id="ui-orders.line.create.success" />,
        type: 'success',
      });

      let pathname = isCreateAnotherChecked
        ? `/orders/view/${id}/po-line/create`
        : `/orders/view/${id}/po-line/view/${savedLine.id}`;

      if (locationState?.instanceId) {
        pathname = saveAndOpen ? `/inventory/view/${locationState.instanceId}` : `/orders/view/${id}`;
      }

      const state = isCreateAnotherChecked ? { isCreateAnotherChecked: true } : {};

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
        state,
      });
    } catch (e) {
      if (e?.validationError === VALIDATION_ERRORS.duplicateLines) {
        setDuplicateLines(e.duplicateLines);

        return toggleNotUnique();
      }
      if (saveAndOpen && savedLine) {
        await memoizedMutator.poLines.DELETE(savedLine);
      }

      if (e?.validationError === VALIDATION_ERRORS.differentAccount) {
        return toggleDifferentAccountModal();
      }

      return handleErrorResponse(e, line);
    } finally {
      setIsLoading(false);
    }
  },

  // eslint-disable-next-line react-hooks/exhaustive-deps
  [
    handleErrorResponse,
    history,
    id,
    isCreateAnotherChecked,
    isValidateDuplicateLines,
    memoizedMutator.poLines,
    openOrder,
    search,
    sendCallout,
    toggleNotUnique,
    toggleDifferentAccountModal,
  ]);

  const createNewOrder = useCallback(
    async () => {
      closeLineLimitExceededModal();
      setIsLoading(true);

      try {
        const newOrder = await cloneOrder(
          order,
          memoizedMutator.lineOrder,
          memoizedMutator.orderNumber,
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
    [
      closeLineLimitExceededModal,
      history,
      memoizedMutator.lineOrder,
      memoizedMutator.orderNumber,
      order,
      savingValues,
      search,
      sendCallout,
    ],
  );

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
    const { saveAndOpen, ...data } = hydratedLine;

    setIsLoading(true);
    setSavingValues(hydratedLine);

    if (isValidateDuplicateLines) {
      try {
        setValidateDuplicateLines(false);

        await validateDuplicateLines(hydratedLine, mutator, resources);
      } catch (e) {
        if (e?.validationError === VALIDATION_ERRORS.duplicateLines) {
          setDuplicateLines(e.duplicateLines);

          setIsLoading(false);

          return toggleNotUnique();
        }
      }
    }

    const line = formatPOLineBeforeSaving(cloneDeep(data));

    delete line.metadata;

    return memoizedMutator.poLines.PUT(line)
      .then(() => openOrder(saveAndOpen))
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
        setTimeout(onCancel);
      })
      .catch((e) => {
        setIsLoading(false);

        if (e?.validationError === VALIDATION_ERRORS.differentAccount) {
          return toggleDifferentAccountModal();
        }

        return handleErrorResponse(e, line);
      });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [
    handleErrorResponse,
    isValidateDuplicateLines,
    memoizedMutator.poLines,
    onCancel,
    openOrder,
    sendCallout,
    toggleNotUnique,
    toggleDifferentAccountModal,
  ]);

  const saveAfterDelete = useCallback(() => {
    updatePOLine(savingValues);
  }, [savingValues, updatePOLine]);

  const getCreatePOLIneInitialValues = useMemo(() => {
    const orderId = order?.id;
    const newObj = {
      source: sourceValues.user,
      cost: {
        currency: stripes.currency,
        discountType: DISCOUNT_TYPE.percentage,
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
      checkinItems: false,
    };

    if (vendor?.id) {
      newObj.eresource.accessProvider = vendor.id;
      newObj.physical.materialSupplier = vendor.id;

      if (vendor.discountPercent) {
        newObj.cost.discountType = DISCOUNT_TYPE.percentage;
        newObj.cost.discount = vendor.discountPercent;
      }
    }

    return newObj;
  }, [createInventorySetting.eresource, createInventorySetting.physical, order, stripes.currency, vendor]);

  const vendorId = order?.vendor;

  useEffect(
    () => {
      if (vendorId) {
        memoizedMutator.orderVendor.GET({ path: `${VENDORS_API}/${vendorId}` })
          .then(
            setVendor({}),
            errorResponse => {
              let response;

              try {
                response = JSON.parse(errorResponse?.message);
              } catch (parsingException) {
                response = errorResponse;
              }

              sendCallout({
                message: <FormattedMessage id="ui-orders.error.fetching.vendor" />,
                type: 'error',
              });

              const message = response?.errors?.[0]?.message;

              if (message) {
                sendCallout({
                  message: <FormattedMessage id={`ui-orders.${message}`} defaultMessage={message} />,
                  type: 'error',
                });
              }
            },
          );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [memoizedMutator.orderVendor, vendorId],
  );

  const { isApprovalRequired } = getConfigSetting(
    get(resources, 'approvalsSetting.records', {}),
  );
  const isOrderApproved = isApprovalRequired ? order?.approved : true;
  const isSaveAndOpenButtonVisible =
    isOpenOrderEnabled &&
    isOrderApproved &&
    order?.workflowStatus === WORKFLOW_STATUS.pending;
  const isntLoaded = !(
    get(resources, 'createInventory.hasLoaded') &&
    !isOrderLoading &&
    (!lineId || poLine) &&
    get(resources, 'approvalsSetting.hasLoaded') &&
    get(resources, `${DICT_CONTRIBUTOR_NAME_TYPES}.hasLoaded`) &&
    vendor &&
    get(resources, 'orderTemplates.hasLoaded') &&
    get(resources, 'locations.hasLoaded') &&
    get(resources, `${DICT_IDENTIFIER_TYPES}.hasLoaded`) &&
    get(resources, 'materialTypes.hasLoaded') &&
    get(order, 'id') === id &&
    !isLinesLimitLoading &&
    !isConfigsFetching &&
    !isOpenOrderSettingsFetching &&
    !isInstanceLoading
  );

  if (isLoading || isntLoaded) return <LoadingView dismissible onClose={onCancel} />;

  const initialValues = lineId ? poLine : getCreatePOLIneInitialValues;
  const onSubmit = lineId ? updatePOLine : submitPOLine;

  const differentAccountsModalLabel = intl.formatMessage({ id: 'ui-orders.differentAccounts.title' });

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
        enableSaveBtn={Boolean(savingValues)}
        linesLimit={linesLimit}
        isCreateAnotherChecked={isCreateAnotherChecked}
        toggleCreateAnother={setCreateAnotherChecked}
        integrationConfigs={integrationConfigs}
        isCreateFromInstance={Boolean(locationState?.instanceId)}
        instance={instance}
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
            onSubmit={() => {
              toggleNotUnique();
              setValidateDuplicateLines(false);
              onSubmit(savingValues);
            }}
            onCancel={() => {
              toggleNotUnique();
              setValidateDuplicateLines(true);
            }}
          />
        )
      }

      {isDifferentAccountModalOpened && (
        <ErrorModal
          aria-label={differentAccountsModalLabel}
          id="order-open-different-account"
          label={differentAccountsModalLabel}
          content={<FormattedMessage id="ui-orders.differentAccounts.message" values={{ accountNumber: accountNumbers.length }} />}
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
  orderVendor: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  createInventory: CREATE_INVENTORY,
  orderTemplates: {
    ...ORDER_TEMPLATES,
    shouldRefresh: () => false,
  },
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
  convertToIsbn13: CONVERT_TO_ISBN13,
  [DICT_IDENTIFIER_TYPES]: IDENTIFIER_TYPES,
  orderNumber: ORDER_NUMBER,
  orders: ORDERS,
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
