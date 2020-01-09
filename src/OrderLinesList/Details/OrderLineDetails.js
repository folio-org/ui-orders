import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import {
  baseManifest,
  LoadingPane,
  Tags,
} from '@folio/stripes-acq-components';

import {
  ORDERS_API,
  LINES_API,
} from '../../components/Utils/api';
import { POLineView } from '../../components/POLine';
import { FILTERS as ORDER_FILTERS } from '../../OrdersList';

const OrderLineDetails = ({
  match,
  mutator,
  onClose,
  parentMutator,
  parentResources,
  resources,
  showToast,
  ...restProps
}) => {
  const lineId = match.params.id;
  const line = get(resources, ['orderLine', 'records', 0], {});
  const order = get(resources, ['order', 'records', 0], {});

  const fetchLineDetails = useCallback(
    () => {
      mutator.orderLine.reset();
      mutator.order.reset();
      mutator.orderLine.GET()
        .then(({ purchaseOrderId }) => {
          mutator.orderId.replace(purchaseOrderId);
          mutator.order.GET();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId],
  );

  useEffect(fetchLineDetails, [lineId]);

  const goToOrderDetails = useCallback(
    () => {
      parentMutator.query.replace({
        _path: `/orders/view/${order.id}`,
        filters: `${ORDER_FILTERS.PO_NUMBER}.${order.poNumber}`,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId],
  );

  const deleteLine = useCallback(
    () => {
      const lineNumber = line.poLineNumber;

      mutator.orderLine.DELETE(line)
        .then(() => {
          showToast('ui-orders.line.delete.success', 'success', { lineNumber });
          parentMutator.query.update({ _path: '/orders/lines' });
        })
        .catch(() => {
          showToast('ui-orders.errors.lineWasNotDeleted', 'error');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId],
  );

  const updateLineTagList = async (orderLine) => {
    await mutator.orderLine.PUT(orderLine);
    fetchLineDetails();
  };

  const [isTagsPaneOpened, setIsTagsPaneOpened] = useState(false);

  const toggleTagsPane = () => setIsTagsPaneOpened(!isTagsPaneOpened);

  const locations = get(parentResources, 'locations.records', []);
  const materialTypes = get(parentResources, 'materialTypes.records', []);
  const vendors = get(parentResources, 'vendors.records', []);
  const funds = get(parentResources, 'funds.records', []);

  const receivingURL = `/orders/view/${order.id}/po-line/view/${lineId}/receiving`;
  const checkinURL = `/orders/view/${order.id}/po-line/view/${lineId}/check-in/items`;

  const isLoading = !(
    get(resources, ['orderLine', 'hasLoaded']) &&
    get(resources, ['order', 'hasLoaded'])
  );

  if (isLoading) {
    return <LoadingPane onClose={onClose} />;
  }

  return (
    <Fragment>
      <POLineView
        {...restProps}
        line={line}
        order={order}
        locations={locations}
        materialTypes={materialTypes}
        vendors={vendors}
        receivingURL={receivingURL}
        checkinURL={checkinURL}
        funds={funds}
        goToOrderDetails={goToOrderDetails}
        queryMutator={parentMutator.query}
        deleteLine={deleteLine}
        tagsToggle={toggleTagsPane}
        onClose={onClose}
      />
      {isTagsPaneOpened && (
        <Tags
          putMutator={updateLineTagList}
          recordObj={line}
          onClose={toggleTagsPane}
        />
      )}
    </Fragment>
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
    path: `${ORDERS_API}/%{orderId}`,
    accumulate: true,
    fetch: false,
  },
  orderId: {},
});

OrderLineDetails.propTypes = {
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  parentMutator: PropTypes.object.isRequired,
  parentResources: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default OrderLineDetails;
