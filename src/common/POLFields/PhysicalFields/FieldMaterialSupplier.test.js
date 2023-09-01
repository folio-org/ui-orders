import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
