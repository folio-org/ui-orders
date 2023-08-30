import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
