import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldPaymentStatus from './FieldPaymentStatus';

const renderFieldPaymentStatus = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldPaymentStatus
        {...props}
      />
    )}
  />,
);

describe('FieldPaymentStatus', () => {
  it('should render \'payment status\' field', () => {
    renderFieldPaymentStatus({ workflowStatus: 'Pending' });

    expect(screen.getByText('ui-orders.poLine.paymentStatus')).toBeInTheDocument();
  });
});
