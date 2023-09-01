import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
