import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
