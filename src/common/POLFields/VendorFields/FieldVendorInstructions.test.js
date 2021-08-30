import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldVendorInstructions from './FieldVendorInstructions';

const renderFieldVendorInstructions = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldVendorInstructions
        {...props}
      />
    )}
  />,
);

describe('FieldVendorInstructions', () => {
  it('should render \'instructions\' field', () => {
    renderFieldVendorInstructions();

    expect(screen.getByText('ui-orders.vendor.instructions')).toBeInTheDocument();
  });
});
