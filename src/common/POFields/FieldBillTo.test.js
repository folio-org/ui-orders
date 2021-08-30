import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldBillTo from './FieldBillTo';

const defaultProps = {
  addresses: [],
};

const renderFieldBillTo = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldBillTo
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldBillTo', () => {
  it('should render \'bill to\' field', () => {
    renderFieldBillTo();

    expect(screen.getByText('ui-orders.orderDetails.billTo')).toBeInTheDocument();
  });
});
