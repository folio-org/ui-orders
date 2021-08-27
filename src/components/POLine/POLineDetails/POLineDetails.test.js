import React from 'react';
import { render, screen } from '@testing-library/react';

import POLineDetails from './POLineDetails';

const renderPOLineDetails = (props = {}) => render(
  <POLineDetails
    {...props}
  />,
);

describe('POLineDetails', () => {
  it('should render \'POLine details\' view', () => {
    renderPOLineDetails();

    expect(screen.getByText('ui-orders.poLine.number')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.acquisitionMethod')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.orderFormat')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.createdOn')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.receiptDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.receiptStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.paymentStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.source')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.donor')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.selector')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.requester')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.cancellationRestriction')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.rush')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.сollection')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.receiveItems')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.cancellationRestrictionNote')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.poLineDescription')).toBeInTheDocument();
  });
});
