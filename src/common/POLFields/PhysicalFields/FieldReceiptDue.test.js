import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldReceiptDue from './FieldReceiptDue';

const renderFieldReceiptDue = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldReceiptDue
        {...props}
      />
    )}
  />,
);

describe('FieldReceiptDue', () => {
  it('should render \'receipt due\' field', () => {
    renderFieldReceiptDue();

    expect(screen.getByText('ui-orders.physical.receiptDue')).toBeInTheDocument();
  });
});
