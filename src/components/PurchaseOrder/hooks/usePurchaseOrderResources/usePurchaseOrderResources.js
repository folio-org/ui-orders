import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import {
  getErrorCodeFromResponse,
  useAcqRestrictions,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useExportHistory,
  useOrder,
  useOrderFiscalYears,
  useOrderLines,
  useOrderTemplate,
} from '../../../../common/hooks';
import {
  getCommonErrorMessage,
  handleOrderLoadingError,
} from '../../../../common/utils';
import { useOrderInvoiceRelationships } from '../useOrderInvoiceRelationships';

const DEFAULT_ORDER = {};

export const usePurchaseOrderResources = (orderId, fiscalYearId) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const {
    fiscalYearsGrouped,
    isFetched: isFiscalYearsFetched,
    isLoading: isFiscalYearsLoading,
    refetch: refetchFiscalYears,
  } = useOrderFiscalYears(orderId);

  const {
    isLoading: isOrderLoading,
    order,
    refetch: refetchOrder,
  } = useOrder(orderId, {
    enabled: isFiscalYearsFetched,
    fiscalYearId,
    onError: handleOrderLoadingError(showCallout),
  });

  const {
    isLoading: isRestrictionsLoading,
    restrictions,
  } = useAcqRestrictions(orderId, order?.acqUnitIds);

  const {
    isLoading: isOrderTemplateLoading,
    orderTemplate,
  } = useOrderTemplate(order?.template);

  const {
    isFetching: isOrderLinesFetching,
    isLoading: isOrderLinesLoading,
    orderLines,
  } = useOrderLines({
    searchParams: { query: `purchaseOrderId==${orderId}` },
    onError: async (errorResponse) => {
      const errorCode = await getErrorCodeFromResponse(errorResponse);
      const defaultMessage = intl.formatMessage({ id: 'ui-orders.errors.orderLinesNotLoaded' });
      const message = getCommonErrorMessage(errorCode, defaultMessage);

      showCallout({
        message,
        type: 'error',
      });
    },
  });

  const poLineIds = useMemo(() => orderLines?.map(({ id }) => id), [orderLines]);

  const {
    isLoading: isExportHistoryLoading,
    exportHistory,
  } = useExportHistory(poLineIds);

  const {
    isLoading: isOrderInvoiceRelationshipsLoading,
    orderInvoiceRelationships,
  } = useOrderInvoiceRelationships(orderId);

  return {
    exportHistory,
    fiscalYearsGrouped,
    isExportHistoryLoading,
    isFiscalYearsFetched,
    isFiscalYearsLoading,
    isOrderInvoiceRelationshipsLoading,
    isOrderLinesFetching,
    isOrderLinesLoading,
    isOrderLoading,
    isOrderTemplateLoading,
    isRestrictionsLoading,
    order: order || DEFAULT_ORDER,
    orderInvoiceRelationships,
    orderLines,
    orderTemplate,
    refetchFiscalYears,
    refetchOrder,
    restrictions,
  };
};
