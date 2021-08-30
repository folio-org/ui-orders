import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldMaterialType from './FieldMaterialType';

const defaultProps = {
  materialTypes: [],
  name: 'name',
};

const renderFieldMaterialType = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldMaterialType
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldMaterialType', () => {
  it('should render \'material type\' field', () => {
    renderFieldMaterialType();

    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
  });
});
