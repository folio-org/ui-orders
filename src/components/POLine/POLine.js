import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { LoadingPane } from '@folio/stripes/components';
import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  DICT_CONTRIBUTOR_NAME_TYPES,
  LINES_API,
  Tags,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  CONTRIBUTOR_NAME_TYPES,
  FUND,
  LOCATIONS,
  MATERIAL_TYPES,
  ORDER,
} from '../Utils/resources';
import POLineView from './POLineView';

function POLine({
  history,
  location: { search },
  match: { params: { id: orderId, lineId } },
  mutator,
  poURL,
  resources,
}) {
  const sendCallout = useShowCallout();
  const [isTagsPaneOpened, toggleTagsPane] = useModalToggle();
  const [order, setOrder] = useState();
  const [line, setLine] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = useCallback(
    () => mutator.lineOrder.GET()
      .then(fetchedOrder => {
        setOrder(fetchedOrder);
        setLine(fetchedOrder?.compositePoLines?.find(u => u.id === lineId));
      })
      .catch(() => {
        sendCallout({
          message: <SafeHTMLMessage id="ui-orders.errors.orderNotLoaded" />,
          type: 'error',
        });
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId, sendCallout],
  );

  useEffect(
    () => {
      setIsLoading(true);
      fetchOrder().finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderId],
  );

  const deleteLine = useCallback(
    () => {
      const lineNumber = line.poLineNumber;

      setIsLoading(true);
      mutator.poLine.DELETE(line, { silent: true })
        .then(() => {
          sendCallout({
            message: <SafeHTMLMessage id="ui-orders.line.delete.success" values={{ lineNumber }} />,
            type: 'success',
          });

          history.push({
            pathname: poURL,
            search,
          });
        })
        .catch(async errorResponse => {
          setIsLoading();
          sendCallout({
            message: <SafeHTMLMessage id="ui-orders.errors.lineWasNotDeleted" />,
            type: 'error',
          });

          let message = null;

          try {
            const response = await errorResponse.json();

            message = response.errors[0].message;
          // eslint-disable-next-line no-empty
          } catch (e) {}

          if (message) {
            sendCallout({
              message,
              timeout: 0,
              type: 'error',
            });
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, line, poURL, search, sendCallout],
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

  if (isLoading || line?.id !== lineId) {
    return (
      <LoadingPane
        defaultWidth="fill"
        dismissible
        onClose={backToOrder}
      />
    );
  }

  const materialTypes = get(resources, ['materialTypes', 'records'], []);
  const locations = get(resources, 'locations.records', []);
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
        tagsToggle={toggleTagsPane}
      />
      {isTagsPaneOpened && (
        <Tags
          putMutator={mutator.poLine.PUT}
          recordObj={line}
          onClose={toggleTagsPane}
        />
      )}
    </>
  );
}

POLine.manifest = Object.freeze({
  lineOrder: {
    ...ORDER,
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
  locations: {
    ...LOCATIONS,
    fetch: true,
  },
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
};

export default stripesConnect(POLine);
