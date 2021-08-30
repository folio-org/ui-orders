import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import CostView from './CostView';

const defaultProps = {
  isPackage: false,
  orderFormat: 'Physical Resource',
  cost: {
    currency: 'USD',
    fyroAdjustmentAmount: 10,
    discountType: 'amount',
  },
};

const renderCostView = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <CostView
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('CostView', () => {
  it('should render \'cost\' view', () => {
    renderCostView();

    expect(screen.getByText('ui-orders.cost.listPriceOfPhysical')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.quantityPhysical')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.currency')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.unitPriceOfElectronic')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.quantityElectronic')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.additionalCost')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.discount')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.estimatedPrice')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.rolloverAdjustment')).toBeInTheDocument();
  });
});
