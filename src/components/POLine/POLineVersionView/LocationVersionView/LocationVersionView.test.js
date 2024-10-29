import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { VersionViewContextProvider } from '@folio/stripes-acq-components';

import { orderLine } from 'fixtures';
import { ORDER_LINES_ROUTE } from '../../../../common/constants';
import { LocationVersionView } from './LocationVersionView';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useCentralOrderingContext: jest.fn(() => ({ isCentralOrderingEnabled: false })),
    useInstanceHoldingsQuery: jest.fn().mockReturnValue({
      isLoading: false,
      holdings: [{ id: 'holdingId' }],
    }),
  };
});

jest.mock('../../../../common/hooks', () => ({
  ...jest.requireActual('../../../../common/hooks'),
  useLocationsAndHoldingsByTenants: jest.fn().mockReturnValue({
    holdings: [{ id: 'holdingId' }],
    locations: [{ id: 'locationId' }],
    isLoading: false,
  }),
}));

const versions = [
  {
    id: 'version-2',
    snapshot: {
      locations: [{
        locationId: 'location-1-id',
        quantityPhysical: 1,
        quantity: 1,
      }],
    },
  },
  {
    id: 'version-1',
    snapshot: {
      locations: [{
        locationId: 'location-1-id',
        quantityPhysical: 2,
        quantityElectronic: 1,
        quantity: 3,
      }],
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

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <VersionViewContextProvider {...contextValues}>
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={[{
          pathname: `${ORDER_LINES_ROUTE}/view/${orderLine.id}/versions/${versions[0].id}`,
        }]}
      >
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  </VersionViewContextProvider>
);

const renderLocationVersionView = (props = {}) => render(
  <LocationVersionView
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('LocationVersionView', () => {
  it('should render location version view with highlighted updates', () => {
    renderLocationVersionView();

    expect(screen.getByText(versions[0].snapshot.locations[0].quantityPhysical)).toBeInTheDocument();
    expect(screen.getByText(versions[0].snapshot.locations[0].quantityPhysical).tagName.toLocaleLowerCase()).toBe('mark');
  });
});
