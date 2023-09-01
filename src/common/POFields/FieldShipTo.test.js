import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldShipTo from './FieldShipTo';

const defaultProps = {
  addresses: [],
};

const renderFieldShipTo = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldShipTo
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldShipTo', () => {
  it('should render \'ship to\' field', () => {
    renderFieldShipTo();

    expect(screen.getByText('ui-orders.orderDetails.shipTo')).toBeInTheDocument();
  });
});
