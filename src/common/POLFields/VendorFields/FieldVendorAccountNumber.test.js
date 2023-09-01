import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
