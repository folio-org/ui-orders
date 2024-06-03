import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useCentralOrderingContext,
  useCurrentUserTenants,
} from '@folio/stripes-acq-components';
import { affiliations } from '@folio/stripes-acq-components/test/jest/fixtures';

import LocationView from './LocationView';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    useCentralOrderingContext: jest.fn(),
    useCurrentUserTenants: jest.fn(),
    useInstanceHoldingsQuery: jest.fn().mockReturnValue({
      isLoading: false,
      holdings: [{ id: 'holdingId' }],
    }),
  };
});

const defaultProps = {
  locations: [{
    holdingId: 'holdingId',
  }],
  lineLocations: [{
    id: 'locationId',
  }],
};

const renderLocationView = (props = {}) => render(
  <LocationView
    {...defaultProps}
    {...props}
  />,
);

describe('LocationView', () => {
  beforeEach(() => {
    useCentralOrderingContext
      .mockClear()
      .mockReturnValue(({ isCentralOrderingEnabled: false }));
    useCurrentUserTenants
      .mockClear()
      .mockReturnValue(affiliations);
  });
  it('should render \'location\' view', () => {
    renderLocationView();

    expect(screen.getByText('ui-orders.location.nameCode')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.location.quantityPhysical')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.location.quantityElectronic')).toBeInTheDocument();
  });

  describe('ECS mode', () => {
    it('should render affiliation value for the location when central ordering is enabled', () => {
      useCentralOrderingContext.mockReturnValue({ isCentralOrderingEnabled: true });

      renderLocationView();

      expect(screen.getByText('stripes-acq-components.consortia.affiliations.select.label')).toBeInTheDocument();
    });
  });
});
