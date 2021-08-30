import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import POLineEresourcesForm from './POLineEresourcesForm';

const defaultProps = {
  formValues: {},
  materialTypes: [],
  change: jest.fn(),
};

const renderPOLineEresourcesForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <POLineEresourcesForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('POLineEresourcesForm', () => {
  it('should render \'POLine e-resources form\' fields', () => {
    renderPOLineEresourcesForm();

    expect(screen.getByText('ui-orders.eresource.accessProvider')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.activationDue')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.expectedActivation')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.createInventory')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.userLimit')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.activationStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.trial')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.eresource.url')).toBeInTheDocument();
  });
});
