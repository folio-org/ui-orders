import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldPOLineNumber from './FieldPOLineNumber';

const renderFieldPOLineNumber = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldPOLineNumber
        {...props}
      />
    )}
  />,
);

describe('FieldPOLineNumber', () => {
  it('should render \'PO line number\' field', () => {
    renderFieldPOLineNumber();

    expect(screen.getByText('ui-orders.poLine.number')).toBeInTheDocument();
  });
});
