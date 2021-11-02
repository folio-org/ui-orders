import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import POLineDetailsForm from './POLineDetailsForm';

const defaultProps = {
  formValues: {},
  createInventorySetting: {},
};

const renderPOLineDetailsForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <POLineDetailsForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('POLineDetailsForm', () => {
  it('should render \'POLine details form\' fields', () => {
    renderPOLineDetailsForm();

    expect(screen.getByText('ui-orders.poLine.number')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.acquisitionMethod')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.orderFormat')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.receiptDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.receiptStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.paymentStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.donor')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.selector')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.requester')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.cancellationRestriction')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.rush')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.сollection')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.receivingWorkflow')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.cancellationRestrictionNote')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.poLineDescription')).toBeInTheDocument();
  });
});
