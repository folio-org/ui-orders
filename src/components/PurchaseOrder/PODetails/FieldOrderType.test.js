import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

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
