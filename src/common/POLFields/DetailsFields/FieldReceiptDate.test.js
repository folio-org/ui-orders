import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldReceiptDate from './FieldReceiptDate';

const renderFieldReceiptDate = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldReceiptDate
        {...props}
      />
    )}
  />,
);

describe('FieldReceiptDate', () => {
  it('should render \'receipt date\' field', () => {
    renderFieldReceiptDate();

    expect(screen.getByText('ui-orders.poLine.receiptDate')).toBeInTheDocument();
  });
});
