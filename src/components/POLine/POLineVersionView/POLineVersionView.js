import get from 'lodash/get';
import {
  memo,
  useCallback,
} from 'react';
import { FormattedMessage } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  IconButton,
  PaneMenu,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import {
  useCentralOrderingContext,
  VersionHistoryPane,
  VersionViewContextProvider,
} from '@folio/stripes-acq-components';

import { VersionView } from '../../../common';
import {
  HIDDEN_ORDER_FIELDS_FOR_VERSION_HISTORY,
  ORDERS_ROUTE,
  ORDER_LINES_ROUTE,
  SYSTEM_UPDATED_FIELDS,
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

  const { isCentralOrderingEnabled } = useCentralOrderingContext();

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
  } = useSelectedPOLineVersion({
    versionId,
    versions,
    snapshotPath,
    centralOrdering: isCentralOrderingEnabled,
  });

  const firstMenu = (
    <PaneMenu>
      <IconButton
        icon="arrow-left"
        id="clickable-backToPO"
        onClick={onVersionClose}
      />
    </PaneMenu>);

  const isVersionLoading = (
    isOrderLineLoading
    || isHistoryLoading
    || isPOLineVersionLoading
  );

  return (
    <VersionViewContextProvider
      snapshotPath={snapshotPath}
      versions={versions}
      versionId={versionId}
    >
      <TitleManager record={orderLine?.poLineNumber} />
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
        <POLineVersion
          version={selectedVersion}
          centralOrdering={isCentralOrderingEnabled}
        />
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
        hiddenFields={HIDDEN_ORDER_FIELDS_FOR_VERSION_HISTORY}
        systemUpdatedFields={SYSTEM_UPDATED_FIELDS}
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
