import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldIsReEncumber from './FieldIsReEncumber';

const renderFieldIsReEncumber = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldIsReEncumber
        {...props}
      />
    )}
  />,
);

describe('FieldIsReEncumber', () => {
  it('should render \'is re-encumber\' field', () => {
    renderFieldIsReEncumber();

    expect(screen.getByText('ui-orders.orderDetails.reEncumber')).toBeInTheDocument();
  });
});
