import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
