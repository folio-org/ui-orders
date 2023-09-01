import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldOrderType from './FieldOrderType';

const renderFieldOrderType = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldOrderType
        {...props}
      />
    )}
  />,
);

describe('FieldOrderType', () => {
  it('should render \'order type\' field', () => {
    renderFieldOrderType();

    expect(screen.getByText('ui-orders.orderDetails.orderType')).toBeInTheDocument();
  });
});
