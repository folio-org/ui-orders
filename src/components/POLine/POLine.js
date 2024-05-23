import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { LoadingPane } from '@folio/stripes/components';
import {
  checkIfUserInCentralTenant,
  stripesConnect,
  stripesShape,
} from '@folio/stripes/core';
import {
  DICT_CONTRIBUTOR_NAME_TYPES,
  getErrorCodeFromResponse,
  LINES_API,
  Tags,
  useCentralOrderingSettings,
  useLocationsQuery,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useOrder,
  useOrderTemplate,
} from '../../common/hooks';
import { getCommonErrorMessage } from '../../common/utils';
import {
  CONTRIBUTOR_NAME_TYPES,
  FUND,
  MATERIAL_TYPES,
  ORDERS,
} from '../Utils/resources';
import POLineView from './POLineView';
import { getCancelledLine } from './utils';

function POLine({
  history,
  location: { search },
  match: { params: { id: orderId, lineId } },
  mutator,
  poURL,
  resources,
  stripes,
}) {
  const intl = useIntl();
  const sendCallout = useShowCallout();
  const [isTagsPaneOpened, toggleTagsPane] = useModalToggle();
  const { isLoading: isLoadingOrder, order } = useOrder(orderId);
  const [line, setLine] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { enabled: isCentralOrderingEnabled } = useCentralOrderingSettings({
    enabled: checkIfUserInCentralTenant(stripes),
  });

  const {
    isLoading: isOrderTemplateLoading,
    orderTemplate,
  } = useOrderTemplate(order?.template);

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: isCentralOrderingEnabled });

  const fetchOrderLine = useCallback(
    () => mutator.poLine.GET({ params: { query: `id==${lineId}` } })
      .catch(async (errorResponse) => {
        const errorCode = await getErrorCodeFromResponse(errorResponse);
        const defaultMessage = intl.formatMessage({ id: 'ui-orders.errors.orderLinesNotLoaded' });
        const message = getCommonErrorMessage(errorCode, defaultMessage);

        sendCallout({
          message,
          type: 'error',
        });

        return [];
      })
      .then((lines) => {
        setLine(lines?.[0] || {});
      }),
    [intl, lineId, mutator.poLine, sendCallout],
  );

  useEffect(
    () => {
      setIsLoading(true);
      fetchOrderLine().finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderId],
  );

  const deleteLine = useCallback(
    () => {
      const lineNumber = line?.poLineNumber;

      setIsLoading(true);
      mutator.poLine.DELETE(line, { silent: true })
        .then(() => {
          sendCallout({
            message: <FormattedMessage id="ui-orders.line.delete.success" values={{ lineNumber }} />,
            type: 'success',
          });

          history.push({
            pathname: poURL,
            search,
          });
        })
        .catch(async errorResponse => {
          const errorCode = await getErrorCodeFromResponse(errorResponse);
          const defaultMessage = intl.formatMessage({ id: 'ui-orders.errors.lineWasNotDeleted' });
          const message = getCommonErrorMessage(errorCode, defaultMessage);

          setIsLoading();
          sendCallout({
            message,
            type: 'error',
          });
        });
    },
    [history, intl, line, mutator.poLine, poURL, search, sendCallout],
  );

  const cancelLine = useCallback(
    () => {
      const lineNumber = line?.poLineNumber;
      const cancelledLine = getCancelledLine(line);

      setIsLoading(true);
      mutator.poLine.PUT(cancelledLine)
        .then(() => {
          sendCallout({
            message: <FormattedMessage id="ui-orders.line.cancel.success" values={{ lineNumber }} />,
            type: 'success',
          });

          return fetchOrderLine();
        })
        .catch(async (errorResponse) => {
          const errorCode = await getErrorCodeFromResponse(errorResponse);
          const defaultMessage = intl.formatMessage({ id: 'ui-orders.errors.lineWasNotCancelled' });
          const message = getCommonErrorMessage(errorCode, defaultMessage);

          setIsLoading();
          sendCallout({
            message,
            type: 'error',
          });
        })
        .finally(setIsLoading);
    },
    [fetchOrderLine, intl, line, mutator.poLine, sendCallout],
  );

  const backToOrder = useCallback(
    () => {
      history.push({
        pathname: poURL,
        search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  const updatePOLineCB = useCallback(async (poLineWithTags) => {
    await mutator.poLine.PUT(poLineWithTags);
    await fetchOrderLine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOrderLine]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchOrderLine();
    setIsLoading(false);
  }, [fetchOrderLine]);

  const isDataLoading = (
    isLoading
    || isLoadingOrder
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
        onClose={backToOrder}
      />
    );
  }

  const materialTypes = get(resources, ['materialTypes', 'records'], []);
  const funds = get(resources, 'fund.records', []);

  return (
    <>
      <POLineView
        line={line}
        onClose={backToOrder}
        order={order}
        materialTypes={materialTypes}
        locations={locations}
        poURL={poURL}
        funds={funds}
        deleteLine={deleteLine}
        cancelLine={cancelLine}
        tagsToggle={toggleTagsPane}
        orderTemplate={orderTemplate}
        refetch={refetch}
      />
      {isTagsPaneOpened && (
        <Tags
          putMutator={updatePOLineCB}
          recordObj={line}
          onClose={toggleTagsPane}
        />
      )}
    </>
  );
}

POLine.manifest = Object.freeze({
  lineOrder: {
    ...ORDERS,
    accumulate: true,
    fetch: false,
  },
  [DICT_CONTRIBUTOR_NAME_TYPES]: CONTRIBUTOR_NAME_TYPES,
  poLine: {
    accumulate: true,
    fetch: false,
    path: LINES_API,
    perRequest: 1000,
    records: 'poLines',
    throwErrors: false,
    type: 'okapi',
  },
  fund: FUND,
  materialTypes: MATERIAL_TYPES,
});

POLine.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
      lineId: PropTypes.string,
    }),
  }).isRequired,
  mutator: PropTypes.object.isRequired,
  poURL: PropTypes.string,
  resources: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default stripesConnect(POLine);
