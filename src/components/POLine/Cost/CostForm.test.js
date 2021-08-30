import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import CostForm from './CostForm';

import { order } from '../../../../test/jest/fixtures';

const defaultProps = {
  formValues: {
    isPackage: false,
    orderFormat: 'Physical Resource',
    cost: {
      currency: 'USD',
      fyroAdjustmentAmount: 10,
    },
  },
  order,
  required: false,
  initialValues: {},
  change: jest.fn(),
};

const renderCostForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <CostForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('CostForm', () => {
  it('should render \'cost form\' fields', () => {
    renderCostForm();

    expect(screen.getByText('ui-orders.cost.listPriceOfPhysical')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.quantityPhysical')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.additionalCost')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.discount')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.discountType')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.cost.estimatedPrice')).toBeInTheDocument();
  });

  it('should change input value', () => {
    renderCostForm();

    user.type(screen.getByLabelText('ui-orders.cost.additionalCost'), '42');

    expect(screen.getByLabelText('ui-orders.cost.additionalCost').value).toBe('42');
  });
});
