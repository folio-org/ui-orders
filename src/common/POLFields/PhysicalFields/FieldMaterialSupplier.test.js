import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldMaterialSupplier from './FieldMaterialSupplier';

const renderFieldMaterialSupplier = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldMaterialSupplier
        {...props}
      />
    )}
  />,
);

describe('FieldMaterialSupplier', () => {
  it('should render \'material supplier\' field', () => {
    renderFieldMaterialSupplier();

    expect(screen.getByText('ui-orders.physical.materialSupplier')).toBeInTheDocument();
  });
});
