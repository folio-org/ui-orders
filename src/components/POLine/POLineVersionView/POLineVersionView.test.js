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
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { orderLineAuditEvent } from '@folio/stripes-acq-components/test/jest/fixtures';

import { orderLine } from 'fixtures';
import {
  AUDIT_ACQ_EVENTS_API,
  ORDER_LINES_ROUTE,
} from '../../../common/constants';
import { useOrderLine } from '../../../common/hooks';
import { useSelectedPOLineVersion } from '../hooks';
import POLineVersionView from './POLineVersionView';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  ExchangeRateValue: jest.fn(() => 'ExchangeRateValue'),
  useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
  useInstanceHoldingsQuery: jest.fn(() => ({ isLoading: false, holdings: [] })),
}));
jest.mock('@folio/stripes-acq-components/lib/hooks/useUsersBatch', () => ({
  useUsersBatch: jest.fn(() => ({ users: [], isLoading: false })),
}));
jest.mock('../../../common/hooks', () => ({
  ...jest.requireActual('../../../common/hooks'),
  useOrderLine: jest.fn(() => {}),
  useOrderLineLocationsByTenants: jest.fn().mockReturnValue({
    holdings: [{ id: 'holdingId' }],
    locations: [{ id: 'locationId' }],
    isLoading: false,
  }),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useSelectedPOLineVersion: jest.fn(() => {}),
}));

const { orderLineSnapshot, ...auditEvent } = orderLineAuditEvent;

const latestSnapshot = {
  ...orderLineSnapshot,
  edition: 'Second edition',
};
const originalSnapshot = { ...orderLineSnapshot };

const versions = [
  {
    ...auditEvent,
    id: 'testAuditEventId',
    orderLineSnapshot: { map: latestSnapshot },
  },
  {
    ...auditEvent,
    orderLineSnapshot: { map: originalSnapshot },
  },
];

const kyMock = {
  get: jest.fn((url) => ({
    json: async () => {
      const result = {};

      if (url.startsWith(`${AUDIT_ACQ_EVENTS_API}/order-line/`)) {
        result.orderLineAuditEvents = versions;
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
        pathname: `${ORDER_LINES_ROUTE}/view/${orderLine.id}/versions`,
      }]}
    >
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const Component = withRouter(POLineVersionView);
const mockDefaultContent = 'Hello world';

const renderPOLineVersionView = (props = {}) => render(
  <Switch>
    <Route
      exact
      path="/orders/lines/view/:id/versions/:versionId?"
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

describe('POLineVersionView', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useOrderLine.mockClear().mockReturnValue({
      isLoading: false,
      orderLine,
    });
    useSelectedPOLineVersion.mockClear().mockImplementation(({ versionId }) => ({
      isLoading: false,
      selectedVersion: {
        [versions[0].id]: latestSnapshot,
        [versions[1].id]: originalSnapshot,
      }[versionId],
    }));
  });

  it('should display POL version details', async () => {
    renderPOLineVersionView();

    const versionBtns = await screen.findAllByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' });

    // Open original version from history
    await user.click(versionBtns[1]);

    expect(screen.queryByText(versions[0].orderLineSnapshot.map.edition)).not.toBeInTheDocument();
    expect(screen.getByText(versions[1].orderLineSnapshot.map.edition)).toBeInTheDocument();

    // Open latest version from history
    await user.click(versionBtns[0]);

    expect(screen.getByText(versions[0].orderLineSnapshot.map.edition)).toBeInTheDocument();
    expect(screen.queryByText(versions[1].orderLineSnapshot.map.edition)).not.toBeInTheDocument();
  });

  it('should close version view when \'Version close\' button was clicked', async () => {
    renderPOLineVersionView();

    await screen.findAllByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' })
      .then(async ([selectVersionBtn]) => user.click(selectVersionBtn));

    await screen.findAllByRole('button', { name: 'stripes-components.closeItem' })
      .then(async ([closeVersionBtn]) => user.click(closeVersionBtn));

    expect(screen.queryByText('ui-orders.line.paneTitle.details')).not.toBeInTheDocument();
    expect(screen.getByText(mockDefaultContent)).toBeInTheDocument();
  });

  it('should close version view when \'History close\' button was clicked', async () => {
    renderPOLineVersionView();

    await screen.findAllByRole('button', { name: 'stripes-acq-components.versionHistory.card.select.tooltip' })
      .then(async ([selectVersionBtn]) => user.click(selectVersionBtn));

    await screen.findAllByRole('button', { name: 'stripes-components.closeItem' })
      .then(async ([_, closeHistoryBtn]) => user.click(closeHistoryBtn));

    expect(screen.queryByText('ui-orders.line.paneTitle.details')).not.toBeInTheDocument();
    expect(screen.getByText(mockDefaultContent)).toBeInTheDocument();
  });
});
