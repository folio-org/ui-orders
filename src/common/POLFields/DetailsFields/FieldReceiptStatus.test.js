import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldReceiptStatus from './FieldReceiptStatus';

const renderFieldReceiptStatus = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldReceiptStatus
        {...props}
      />
    )}
  />,
);

describe('FieldReceiptStatus', () => {
  it('should render \'receipt status\' field', () => {
    renderFieldReceiptStatus({ workflowStatus: 'Pending' });

    expect(screen.getByText('ui-orders.poLine.receiptStatus')).toBeInTheDocument();
  });
});
