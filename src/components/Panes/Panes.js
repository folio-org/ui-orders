import { useState } from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';

import {
  IfPermission,
} from '@folio/stripes/core';
import { VersionHistoryPane } from '@folio/stripes-acq-components';

// TODO: remove during UIOR-1036
import {
  orderAuditEvent,
  orderLineAuditEvent,
} from '@folio/stripes-acq-components/test/jest/fixtures';

import {
  ORDERS_ROUTE,
  ORDER_LINE_VIEW_ROUTE,
  ORDER_LINE_VIEW_VERSIONS_ROUTE,
  ORDER_VIEW_ROUTE,
  ORDER_VIEW_VERSIONS_ROUTE,
} from '../../common/constants';
import { PO } from '../PurchaseOrder';
import { getPoFieldsLabelMap } from '../PurchaseOrder/util';
import { POLine } from '../POLine';
import { getPoLineFieldsLabelMap } from '../POLine/utils';

// TODO: remove during UIOR-1036
const mockLineSnapshot = { ...orderLineAuditEvent.orderLineSnapshot };
const mockVersions = [
  {
    ...orderLineAuditEvent,
    id: 'qwerty12345',
    userId: '3c963ca5-7575-4c2a-8a15-a6598db734ba',
    orderLineSnapshot: { ...mockLineSnapshot, publicationDate: '1998' },
  },
  {
    ...orderLineAuditEvent,
    id: 'qwerty1234',
    userId: '6c963ca5-7575-4c2a-8a15-a6598db734ba',
    orderLineSnapshot: { ...mockLineSnapshot, poLineDescription: 'Test desc' },
  },
  { ...orderLineAuditEvent, id: 'qwerty123' },
];
const mockOrderVersions = [
  {
    ...orderAuditEvent,
    id: 'qwerty123456',
    orderSnapshot: {
      id: 'c4abf6c3-4bd5-4464-999b-c66cfb6f1cf9',
      tags: {
        tagList: [
          'amazon1',
        ],
      },
      notes: [
        'Check credit card statement to make sure payment shows up',
        'Check credit card statement to make sure payment shows up 2',
      ],
      poNumber: 'test10000',
      template: '4dee318b-f5b3-40dc-be93-cc89b8c45b6d',
      orderType: 'Ongoing',
      acqUnitIds: ['123'],
      reEncumber: false,
      poNumberPrefix: 'test',
      poNumberSuffix: '',
      workflowStatus: 'Open',
    },
  },
  {
    ...orderAuditEvent,
    id: 'qwerty12345',
  },
];
/* */

const Panes = ({
  history,
  location,
  match: { url, params },
  refreshList,
}) => {
  // TODO: move logic to the VersionView component (UIOR-1036)
  const [currentVersion, setCurrentVersion] = useState(params?.versionId || mockVersions[0].id);

  return (
    <Switch>
      <Route
        exact
        path={ORDER_VIEW_ROUTE}
        render={props => (
          <PO
            {...props}
            refreshList={refreshList}
          />
        )}
      />

      <Route
        exact
        path={ORDER_VIEW_VERSIONS_ROUTE}
        render={
          // TODO: replace this render with POVersionView component after its implementation (UIOR-1036)
          props => (
            <>
              <PO
                {...props}
                refreshList={refreshList}
              />
              <VersionHistoryPane
                id="order"
                onClose={() => history.push({
                  pathname: `${ORDERS_ROUTE}/view/${props.match.params.id}`,
                  search: location.search,
                })}
                onSelectVersion={setCurrentVersion}
                currentVersion={currentVersion}
                labelsMap={getPoFieldsLabelMap()}
                snapshotPath="orderSnapshot"
                versions={mockOrderVersions}
              />
            </>
          )
        }
      />

      <IfPermission perm="orders.po-lines.item.get">
        <Route
          exact
          path={ORDER_LINE_VIEW_ROUTE}
          render={
            props => (
              <POLine
                poURL={url}
                {...props}
              />
            )
          }
        />

        <Route
          exact
          path={ORDER_LINE_VIEW_VERSIONS_ROUTE}
          render={
            // TODO: replace this render with POLineVersionView component after its implementation (UIOR-1036)
            props => (
              <>
                <POLine
                  poURL={url}
                  {...props}
                />
                <VersionHistoryPane
                  id="order-line"
                  onClose={() => history.push({
                    pathname: `${ORDERS_ROUTE}/view/${props.match.params.id}/po-line/view/${props.match.params.lineId}`,
                    search: location.search,
                  })}
                  onSelectVersion={setCurrentVersion}
                  currentVersion={currentVersion}
                  labelsMap={getPoLineFieldsLabelMap({})}
                  snapshotPath="orderLineSnapshot"
                  versions={mockVersions}
                />
              </>
            )
          }
        />
      </IfPermission>
    </Switch>
  );
};

Panes.propTypes = {
  history: ReactRouterPropTypes.history,
  location: ReactRouterPropTypes.location,
  match: ReactRouterPropTypes.match,
  refreshList: PropTypes.func.isRequired,
};

export default Panes;
