import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import EresourcesForm from './EresourcesForm';

import { order } from '../../../../test/jest/fixtures';

const defaultProps = {
  materialTypes: [{
    label: 'label',
    value: 'value',
  }],
  formValues: {
    eresource: {
      accessProvider: 'accessProvider',
      createInventory: 'Inventory',
    },
  },
  order,
  initialValues: {},
  change: jest.fn(),
};

const renderEresourcesForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <EresourcesForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('EresourcesForm', () => {
  it('should render \'eresources form\' fields', () => {
    renderEresourcesForm();

    expect(screen.getByText('ui-orders.eresource.accessProvider')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.activationStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.activationDue')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.createInventory')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.trial')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.expectedActivation')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.userLimit')).toBeInTheDocument();
  });
});
