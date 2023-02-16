import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { VersionViewContextProvider } from '@folio/stripes-acq-components';

import { orderLine } from '../../../../../test/jest/fixtures';
import { ORDER_LINES_ROUTE } from '../../../../common/constants';
import { LocationVersionView } from './LocationVersionView';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useLineHoldings: jest.fn().mockReturnValue({
      isLoading: false,
      holdings: [{ id: 'holdingId' }],
    }),
  };
});

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

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <VersionViewContextProvider {...contextValues}>
    <MemoryRouter
      initialEntries={[{
        pathname: `${ORDER_LINES_ROUTE}/view/${orderLine.id}/versions/${versions[0].id}`,
      }]}
    >
      {children}
    </MemoryRouter>
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
