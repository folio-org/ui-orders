import React from 'react';
import { act, render, screen } from '@testing-library/react';

import OrdersListFilters from './OrdersListFilters';

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
};

const renderOrdersListFilters = (props) => render(
  <OrdersListFilters
    {...defaultProps}
    {...props}
  />,
);

describe('OrdersListFilters', () => {
  it('should display order filters', async () => {
    await act(async () => renderOrdersListFilters());

    expect(screen.getByText('ui-orders.workflowStatus')).toBeDefined();
    expect(screen.getByText('ui-orders.orderDetails.orderNumberPrefix')).toBeDefined();
    expect(screen.getByText('ui-orders.orderDetails.orderNumberSuffix')).toBeDefined();
    expect(screen.getByText('ui-orders.orderSummary.approved')).toBeDefined();
    expect(screen.getByText('stripes-acq-components.filter.acqUnit')).toBeDefined();
    expect(screen.getByText('ui-orders.orderDetails.assignedTo')).toBeDefined();
    expect(screen.getByText('ui-orders.orderDetails.createdBy')).toBeDefined();
    expect(screen.getByText('ui-orders.filter.dateCreated')).toBeDefined();
    expect(screen.getByText('ui-orders.dateOpened')).toBeDefined();
    expect(screen.getByText('ui-orders.order.orderType')).toBeDefined();
    expect(screen.getByText('ui-orders.line.accordion.vendor')).toBeDefined();
    expect(screen.getByText('stripes-acq-components.filter.tags')).toBeDefined();
    expect(screen.getByText('ui-orders.orderSummary.closingReason')).toBeDefined();
    expect(screen.getByText('ui-orders.orderDetails.reEncumber')).toBeDefined();
    expect(screen.getByText('ui-orders.renewals.subscription')).toBeDefined();
    expect(screen.getByText('ui-orders.renewals.renewalDate')).toBeDefined();
    expect(screen.getByText('ui-orders.renewals.manualRenewal')).toBeDefined();
    expect(screen.getByText('ui-orders.renewals.reviewPeriod')).toBeDefined();
    expect(screen.getByText('ui-orders.orderDetails.billTo')).toBeDefined();
    expect(screen.getByText('ui-orders.orderDetails.shipTo')).toBeDefined();
  });
});
