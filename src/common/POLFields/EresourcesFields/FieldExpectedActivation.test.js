import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldExpectedActivation from './FieldExpectedActivation';

const renderFieldExpectedActivation = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldExpectedActivation
        {...props}
      />
    )}
  />,
);

describe('FieldExpectedActivation', () => {
  it('should render \'expected activation\' field', () => {
    renderFieldExpectedActivation();

    expect(screen.getByText('ui-orders.eresource.expectedActivation')).toBeInTheDocument();
  });
});
