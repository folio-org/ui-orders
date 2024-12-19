import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
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

import {
  ORDERS_API,
  LINES_API,
} from '../../components/Utils/api';
import {
  FUND,
  MATERIAL_TYPES,
} from '../../components/Utils/resources';
import { getCancelledLine } from '../../components/POLine/utils';
import { POLineView } from '../../components/POLine';
import { FILTERS as ORDER_FILTERS } from '../../OrdersList';
import { useOrderTemplate } from '../../common/hooks';

const OrderLineDetails = ({
  history,
  location,
  match,
  mutator,
  refreshList,
  resources,
}) => {
  const lineId = match.params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [line, setLine] = useState({});
  const [order, setOrder] = useState({});
  const showToast = useShowCallout();

  const { isCentralOrderingEnabled } = useCentralOrderingContext();

  const {
    isLoading: isOrderTemplateLoading,
    orderTemplate,
  } = useOrderTemplate(order?.template);

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const fetchLineDetails = useCallback(
    () => {
      setLine({});
      setOrder({});

      return mutator.orderLine.GET()
        .then(lineResponse => {
          setLine(lineResponse);

          return mutator.order.GET({ path: `${ORDERS_API}/${lineResponse.purchaseOrderId}` });
        })
        .then(setOrder);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId],
  );

  useEffect(
    () => {
      setIsLoading(true);
      fetchLineDetails().finally(setIsLoading);
    },
    [fetchLineDetails, lineId],
  );

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

          return fetchLineDetails();
        })
        .catch(() => {
          setIsLoading();
          showToast({
            messageId: 'ui-orders.errors.lineWasNotCancelled',
            type: 'error',
          });
        })
        .finally(setIsLoading);
    },
    [fetchLineDetails, line, mutator.orderLine, showToast],
  );

  const updateLineTagList = async (orderLine) => {
    await mutator.orderLine.PUT(orderLine);
    fetchLineDetails();
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

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchLineDetails();
    setIsLoading(false);
  }, [fetchLineDetails]);

  const isDataLoading = (
    isLoading
    || line?.id !== lineId
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
        refetch={refetch}
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
