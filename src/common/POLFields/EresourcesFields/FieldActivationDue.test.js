import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldActivationDue from './FieldActivationDue';

const renderFieldActivationDue = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldActivationDue
        {...props}
      />
    )}
  />,
);

describe('FieldActivationDue', () => {
  it('should render \'activation due\' field', () => {
    renderFieldActivationDue();

    expect(screen.getByText('ui-orders.eresource.activationDue')).toBeInTheDocument();
  });
});
