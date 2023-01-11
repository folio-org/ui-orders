import ReactRouterPropTypes from 'react-router-prop-types';
import { memo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import { VersionHistoryPane } from '@folio/stripes-acq-components';

import { VersionView } from '../../../common';
import { ORDERS_ROUTE } from '../../../common/constants';
import { useOrder } from '../../../common/hooks';
import {
  usePOVersions,
  useSelectedPOVersion,
} from '../hooks';
import { getPoFieldsLabelMap } from '../util';
import POVersion from './POVersion';

const POVersionView = ({
  history,
  location,
  match,
}) => {
  const { id: orderId, versionId } = match.params;
  const orderPathname = `${ORDERS_ROUTE}/view/${orderId}`;
  const snapshotPath = 'orderSnapshot.map';

  const { isLoading: isOrderLoading, order } = useOrder(orderId);

  const onHistoryClose = useCallback(() => history.push({
    pathname: orderPathname,
    search: location.search,
  }), [history, location.search, orderPathname]);

  const onVersionClose = useCallback(() => history.push({
    pathname: ORDERS_ROUTE,
    search: location.search,
  }), [history, location.search]);

  const onSelectVersion = useCallback((_versionId) => {
    history.push({
      pathname: `${orderPathname}/versions/${_versionId}`,
      search: location.search,
    });
  }, [history, location.search, orderPathname]);

  const { versions, isLoading: isHistoryLoading } = usePOVersions(orderId, {
    onSuccess: ({ orderAuditEvents }) => {
      if (!versionId && orderAuditEvents[0]?.id) onSelectVersion(orderAuditEvents[0].id);
    },
  });

  const {
    isLoading: isPOVersionLoading,
    selectedVersion,
  } = useSelectedPOVersion({ versionId, versions, snapshotPath });

  const isVersionLoading = isOrderLoading || isHistoryLoading || isPOVersionLoading;

  return (
    <>
      <VersionView
        id="order"
        dismissible
        isLoading={isVersionLoading}
        onClose={onVersionClose}
        paneTitle={<FormattedMessage id="ui-orders.order.paneTitle.details" values={{ orderNumber: order?.poNumber }} />}
        tags={get(order, 'tags.tagList', [])}
      >
        <POVersion
          version={selectedVersion}
        />
      </VersionView>
      <VersionHistoryPane
        currentVersion={versionId}
        id="order"
        isLoading={isHistoryLoading}
        onClose={onHistoryClose}
        onSelectVersion={onSelectVersion}
        snapshotPath={snapshotPath}
        labelsMap={getPoFieldsLabelMap()}
        versions={versions}
      />
    </>
  );
};

POVersionView.propTypes = {
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
  match: ReactRouterPropTypes.match,
};

export default memo(POVersionView);
