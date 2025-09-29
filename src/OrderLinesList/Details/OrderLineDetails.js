import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  useCallback,
  useState,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import { LoadingPane } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  Tags,
  useCentralOrderingContext,
  useLocationsQuery,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { LINES_API } from '../../components/Utils/api';
import {
  FUND,
  MATERIAL_TYPES,
} from '../../components/Utils/resources';
import { getCancelledLine } from '../../components/POLine/utils';
import { POLineView } from '../../components/POLine';
import { FILTERS as ORDER_FILTERS } from '../../OrdersList';
import {
  useOrder,
  useOrderLine,
  useOrderTemplate,
} from '../../common/hooks';
import { handleOrderLoadingError } from '../../common/utils';

const OrderLineDetails = ({
  history,
  location,
  match,
  mutator,
  refreshList,
  resources,
}) => {
  const lineId = match.params.id;
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useShowCallout();

  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const {
    isLoading: isOrderLineLoading,
    orderLine: line,
    refetch: refetchOrderLine,
  } = useOrderLine(lineId);

  const {
    isLoading: isOrderLoading,
    order,
  } = useOrder(
    line?.purchaseOrderId,
    {
      onError: handleOrderLoadingError(showToast),
    },
  );

  const {
    isLoading: isOrderTemplateLoading,
    orderTemplate,
  } = useOrderTemplate(order?.template);

  const goToOrderDetails = useCallback(
    () => {
      history.push({
        pathname: `/orders/view/${order.id}`,
        search: `qindex=${ORDER_FILTERS.PO_NUMBER}&query=${order.poNumber}`,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId, order],
  );

  const goToReceive = useCallback(() => {
    history.push({
      pathname: '/receiving',
      search: `qindex=poLine.poLineNumber&query=${line?.poLineNumber}`,
    });
  }, [history, line?.poLineNumber]);

  const deleteLine = useCallback(
    () => {
      const lineNumber = line.poLineNumber;

      setIsLoading(true);
      mutator.orderLine.DELETE(line)
        .then(() => {
          showToast({
            messageId: 'ui-orders.line.delete.success',
            type: 'success',
            values: { lineNumber },
          });
          refreshList();
          history.replace({
            pathname: '/orders/lines',
            search: location.search,
          });
        })
        .catch(() => {
          setIsLoading();
          showToast({
            messageId: 'ui-orders.errors.lineWasNotDeleted',
            type: 'error',
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId, location.search, showToast],
  );

  const cancelLine = useCallback(
    () => {
      const lineNumber = line?.poLineNumber;
      const cancelledLine = getCancelledLine(line);

      setIsLoading(true);
      mutator.orderLine.PUT(cancelledLine)
        .then(() => {
          showToast({
            messageId: 'ui-orders.line.cancel.success',
            values: { lineNumber },
            type: 'success',
          });

          return refetchOrderLine();
        })
        .catch(() => {
          setIsLoading(false);
          showToast({
            messageId: 'ui-orders.errors.lineWasNotCancelled',
            type: 'error',
          });
        })
        .finally(() => setIsLoading(false));
    },
    [line, mutator.orderLine, refetchOrderLine, showToast],
  );

  const updateLineTagList = async (orderLine) => {
    await mutator.orderLine.PUT(orderLine);
    refetchOrderLine();
  };

  const [isTagsPaneOpened, setIsTagsPaneOpened] = useState(false);

  const toggleTagsPane = () => setIsTagsPaneOpened(!isTagsPaneOpened);

  const materialTypes = get(resources, 'materialTypes.records', []);
  const funds = get(resources, 'funds.records', []);

  const onClose = useCallback(
    () => {
      history.push({
        pathname: '/orders/lines',
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  const isDataLoading = (
    isLoading
    || line?.id !== lineId
    || isOrderLineLoading
    || isOrderLoading
    || isOrderTemplateLoading
    || isLocationsLoading
  );

  if (isDataLoading) {
    return (
      <LoadingPane
        id="order-lines-details"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <>
      <POLineView
        line={line}
        order={order}
        locations={locations}
        materialTypes={materialTypes}
        funds={funds}
        goToOrderDetails={goToOrderDetails}
        goToReceive={goToReceive}
        deleteLine={deleteLine}
        cancelLine={cancelLine}
        tagsToggle={toggleTagsPane}
        onClose={onClose}
        orderTemplate={orderTemplate}
        refetch={refetchOrderLine}
      />
      {isTagsPaneOpened && (
        <Tags
          putMutator={updateLineTagList}
          recordObj={line}
          onClose={toggleTagsPane}
        />
      )}
    </>
  );
};

OrderLineDetails.manifest = Object.freeze({
  orderLine: {
    ...baseManifest,
    path: `${LINES_API}/:{id}`,
    accumulate: true,
    fetch: false,
  },
  order: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  materialTypes: MATERIAL_TYPES,
  funds: FUND,
});

OrderLineDetails.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  refreshList: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(OrderLineDetails);
