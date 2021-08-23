import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldVendorAccountNumber from './FieldVendorAccountNumber';

const renderFieldVendorAccountNumber = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldVendorAccountNumber
        {...props}
      />
    )}
  />,
);

describe('FieldVendorAccountNumber', () => {
  it('should render \'account number\' field', () => {
    renderFieldVendorAccountNumber();

    expect(screen.getByText('ui-orders.vendor.accountNumber')).toBeInTheDocument();
  });
});
