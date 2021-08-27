import React from 'react';
import { render, screen } from '@testing-library/react';

import LocationView from './LocationView';

jest.mock('./useLineHoldings', () => ({
  useLineHoldings: jest.fn().mockReturnValue({
    isLoading: false,
    holdings: [{ id: 'holdingId' }],
  }),
}));

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
