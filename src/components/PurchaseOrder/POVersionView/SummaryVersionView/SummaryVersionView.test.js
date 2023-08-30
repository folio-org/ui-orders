import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import {
  VersionViewContextProvider,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import { order } from 'fixtures';
import { ORDERS_ROUTE } from '../../../../common/constants';
import { SummaryVersionView } from './SummaryVersionView';

const versions = [
  {
    id: 'version-2',
    snapshot: {
      workflowStatus: ORDER_STATUSES.closed,
      closeReason: {
        reason: 'Cancelled',
        note: 'Test',
      },
    },
  },
  {
    id: 'version-1',
    snapshot: {
      workflowStatus: ORDER_STATUSES.open,
    },
  },
];

const defaultProps = {
  version: versions[0].snapshot,
};

const contextValues = {
  snapshotPath: 'snapshot',
  versionId: versions[0].id,
  versions,
};

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <VersionViewContextProvider {...contextValues}>
    <MemoryRouter
      initialEntries={[{
        pathname: `${ORDERS_ROUTE}/view/${order.id}/versions/${versions[0].id}`,
      }]}
    >
      {children}
    </MemoryRouter>
  </VersionViewContextProvider>
);

const renderSummaryVersionView = (props = {}) => render(
  <SummaryVersionView
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('SummaryVersionView', () => {
  describe('Closing reason', () => {
    it('should render closing reason value', () => {
      renderSummaryVersionView();

      expect(screen.getByText('ui-orders.orderSummary.closingReason').nextSibling.textContent).toBe('ui-orders.closeOrderModal.closingReasons.cancelled');
    });

    it('should display <NoValue /> component when the closing reason is not provided', () => {
      renderSummaryVersionView({ version: { ...defaultProps.version, closeReason: undefined } });

      expect(screen.getByText('ui-orders.orderSummary.closingReason').nextSibling.textContent).toBe('stripes-components.noValue.noValueSet-');
    });
  });
});
