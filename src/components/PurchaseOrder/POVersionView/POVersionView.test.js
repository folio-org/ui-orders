import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  MemoryRouter,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';
import { orderAuditEvent } from '@folio/stripes-acq-components/test/jest/fixtures';

import { order } from 'fixtures';
import {
  AUDIT_ACQ_EVENTS_API,
  ORDERS_ROUTE,
  ORDER_VIEW_VERSIONS_ROUTE,
  WORKFLOW_STATUS,
} from '../../../common/constants';
import { useOrder } from '../../../common/hooks';
import { useSelectedPOVersion } from '../hooks';
import POVersionView from './POVersionView';

jest.mock('@folio/stripes-acq-components/lib/hooks/useUsersBatch', () => ({
  useUsersBatch: jest.fn(() => ({ users: [], isLoading: false })),
}));
jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useOrder: jest.fn(() => {}),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useSelectedPOVersion: jest.fn(() => {}),
}));

const ORDER_STATUS_LABEL = {
  [ORDER_STATUSES.pending]: 'stripes-acq-components.order.status.pending',
  [ORDER_STATUSES.open]: 'stripes-acq-components.order.status.open',
  [ORDER_STATUSES.closed]: 'stripes-acq-components.order.status.closed',
};

const { orderSnapshot, ...auditEvent } = orderAuditEvent;

const latestSnapshot = {
  ...orderSnapshot,
  workflowStatus: WORKFLOW_STATUS.open,
};
const originalSnapshot = { ...orderSnapshot };

const versions = [
  {
    ...auditEvent,
    id: 'testAuditEventId',
    orderSnapshot: { map: latestSnapshot },
  },
  {
    ...auditEvent,
    orderSnapshot: { map: originalSnapshot },
  },
];

const kyMock = {
  get: jest.fn((url) => ({
    json: async () => {
      const result = {};

      if (url.startsWith(`${AUDIT_ACQ_EVENTS_API}/order/`)) {
        result.orderAuditEvents = versions;
      }

      return Promise.resolve({
        isLoading: false,
        ...result,
      });
    },
  })),
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter
      initialEntries={[{
        pathname: `${ORDERS_ROUTE}/view/${order.id}/versions`,
      }]}
    >
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const Component = withRouter(POVersionView);
const mockDefaultContent = 'Hello world';

const renderPOVersionView = (props = {}) => render(
  <Switch>
    <Route
      exact
      path={ORDER_VIEW_VERSIONS_ROUTE}
      render={() => (
        <Component
          {...props}
        />
      )}
    />
    <Route
      render={() => (
        <div>{mockDefaultContent}</div>
      )}
    />
  </Switch>,
  { wrapper },
);

describe('POVersionView', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useOrder.mockClear().mockReturnValue({
      isLoading: false,
      order,
    });
    useSelectedPOVersion.mockClear().mockImplementation(({ versionId }) => ({
      isLoading: false,
      selectedVersion: {
        [versions[0].id]: latestSnapshot,
        [versions[1].id]: originalSnapshot,
      }[versionId],
    }));
  });

  it('should display PO version details', async () => {
    renderPOVersionView();

    const versionBtns = await screen.findAllByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' });

    // Open original version from history
    await act(async () => user.click(versionBtns[1]));

    expect(
      screen.queryByText(ORDER_STATUS_LABEL[versions[0].orderSnapshot.map.workflowStatus]),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(ORDER_STATUS_LABEL[versions[1].orderSnapshot.map.workflowStatus]),
    ).toBeInTheDocument();

    // Open latest version from history
    await act(async () => user.click(versionBtns[0]));

    expect(
      screen.getByText(ORDER_STATUS_LABEL[versions[0].orderSnapshot.map.workflowStatus]),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(ORDER_STATUS_LABEL[versions[1].orderSnapshot.map.workflowStatus]),
    ).not.toBeInTheDocument();
  });

  it('should close version view when \'Version close\' button was clicked', async () => {
    renderPOVersionView();

    await screen.findAllByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' })
      .then(async ([selectVersionBtn]) => user.click(selectVersionBtn));

    await screen.findAllByRole('button', { name: 'stripes-components.closeItem' })
      .then(async ([closeVersionBtn]) => user.click(closeVersionBtn));

    expect(screen.queryByText('ui-orders.order.paneTitle.details')).not.toBeInTheDocument();
    expect(screen.getByText(mockDefaultContent)).toBeInTheDocument();
  });

  it('should close version view when \'History close\' button was clicked', async () => {
    renderPOVersionView();

    await screen.findAllByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' })
      .then(async ([selectVersionBtn]) => user.click(selectVersionBtn));

    await screen.findAllByRole('button', { name: 'stripes-components.closeItem' })
      .then(async ([_, closeHistoryBtn]) => user.click(closeHistoryBtn));

    expect(screen.queryByText('ui-orders.order.paneTitle.details')).not.toBeInTheDocument();
    expect(screen.getByText(mockDefaultContent)).toBeInTheDocument();
  });
});
