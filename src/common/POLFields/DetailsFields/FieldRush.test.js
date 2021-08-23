import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldRush from './FieldRush';

const renderFieldRush = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldRush
        {...props}
      />
    )}
  />,
);

describe('FieldRush', () => {
  it('should render \'rush\' field', () => {
    renderFieldRush();

    expect(screen.getByText('ui-orders.poLine.rush')).toBeInTheDocument();
  });
});
