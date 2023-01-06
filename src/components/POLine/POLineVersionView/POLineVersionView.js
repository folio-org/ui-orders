import ReactRouterPropTypes from 'react-router-prop-types';
import { memo, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  IconButton,
  PaneMenu,
} from '@folio/stripes/components';
import {
  VersionHistoryPane,
  VersionViewContextProvider,
} from '@folio/stripes-acq-components';

import { VersionView } from '../../../common';
import {
  ORDERS_ROUTE,
  ORDER_LINES_ROUTE,
} from '../../../common/constants';
import { useOrderLine } from '../../../common/hooks';
import {
  usePOLineVersions,
  useSelectedPOLineVersion,
} from '../hooks';
import { getPoLineFieldsLabelMap } from '../utils';
import POLineVersion from './POLineVersion';

const POLineVersionView = ({
  history,
  location,
  match,
}) => {
  const { id, lineId, versionId } = match.params;
  const orderLineId = lineId || id;
  const orderId = lineId && id;
  const snapshotPath = 'orderLineSnapshot.map';

  const { isLoading: isOrderLineLoading, orderLine } = useOrderLine(orderLineId);

  const orderLinePathname = orderId
    ? `${ORDERS_ROUTE}/view/${orderId}/po-line/view/${orderLineId}`
    : `${ORDER_LINES_ROUTE}/view/${orderLineId}`;

  const onHistoryClose = useCallback(() => history.push({
    pathname: orderLinePathname,
    search: location.search,
  }), [history, location.search, orderLinePathname]);

  const onVersionClose = useCallback(() => history.push({
    pathname: orderId ? `${ORDERS_ROUTE}/view/${orderId}` : ORDER_LINES_ROUTE,
    search: location.search,
  }), [history, location.search, orderId]);

  const onSelectVersion = useCallback((_versionId) => {
    history.push({
      pathname: `${orderLinePathname}/versions/${_versionId}`,
      search: location.search,
    });
  }, [history, location.search, orderLinePathname]);

  const {
    versions,
    isLoading: isHistoryLoading,
  } = usePOLineVersions(orderLineId, {
    onSuccess: ({ orderLineAuditEvents }) => {
      if (!versionId && orderLineAuditEvents[0]?.id) onSelectVersion(orderLineAuditEvents[0].id);
    },
  });

  const {
    selectedVersion,
    isLoading: isPOLineVersionLoading,
  } = useSelectedPOLineVersion({ versionId, versions, snapshotPath });

  const firstMenu = (
    <PaneMenu>
      <IconButton
        icon="arrow-left"
        id="clickable-backToPO"
        onClick={onVersionClose}
      />
    </PaneMenu>);

  const isVersionLoading = isOrderLineLoading || isHistoryLoading || isPOLineVersionLoading;

  return (
    <VersionViewContextProvider
      snapshotPath={snapshotPath}
      versions={versions}
      versionId={versionId}
    >
      <VersionView
        id="order-line"
        isLoading={isVersionLoading}
        dismissible={!orderId}
        onClose={onVersionClose}
        firstMenu={orderId ? firstMenu : null}
        paneTitle={<FormattedMessage id="ui-orders.line.paneTitle.details" values={{ poLineNumber: orderLine?.poLineNumber }} />}
        paneSub={orderLine?.titleOrPackage}
        tags={get(orderLine, 'tags.tagList', [])}
      >
        <POLineVersion version={selectedVersion} />
      </VersionView>

      <VersionHistoryPane
        currentVersion={versionId}
        id="order-line"
        isLoading={isHistoryLoading}
        onClose={onHistoryClose}
        onSelectVersion={onSelectVersion}
        snapshotPath={snapshotPath}
        labelsMap={getPoLineFieldsLabelMap(selectedVersion)}
        versions={versions}
      />
    </VersionViewContextProvider>
  );
};

POLineVersionView.propTypes = {
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
  match: ReactRouterPropTypes.match,
};

export default memo(POLineVersionView);
