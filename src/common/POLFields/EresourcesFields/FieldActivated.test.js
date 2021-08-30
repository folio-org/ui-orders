import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldActivated from './FieldActivated';

const renderFieldActivated = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldActivated
        {...props}
      />
    )}
  />,
);

describe('FieldActivated', () => {
  it('should render \'activation status\' field', () => {
    renderFieldActivated();

    expect(screen.getByText('ui-orders.eresource.activationStatus')).toBeInTheDocument();
  });
});
