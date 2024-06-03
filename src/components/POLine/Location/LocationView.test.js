import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import LocationView from './LocationView';

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
  it('should render \'location\' view', () => {
    renderLocationView();

    expect(screen.getByText('ui-orders.location.nameCode')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.location.quantityPhysical')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.location.quantityElectronic')).toBeInTheDocument();
  });
});
