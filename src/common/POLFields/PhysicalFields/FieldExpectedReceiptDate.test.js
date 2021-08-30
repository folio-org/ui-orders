import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldExpectedReceiptDate from './FieldExpectedReceiptDate';

const renderFieldExpectedReceiptDate = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldExpectedReceiptDate
        {...props}
      />
    )}
  />,
);

describe('FieldExpectedReceiptDate', () => {
  it('should render \'expected receipt date\' field', () => {
    renderFieldExpectedReceiptDate();

    expect(screen.getByText('ui-orders.physical.expectedReceiptDate')).toBeInTheDocument();
  });
});
