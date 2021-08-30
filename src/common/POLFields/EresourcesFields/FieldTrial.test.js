import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldTrial from './FieldTrial';

const renderFieldTrial = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldTrial
        {...props}
      />
    )}
  />,
);

describe('FieldTrial', () => {
  it('should render \'trial\' field', () => {
    renderFieldTrial();

    expect(screen.getByText('ui-orders.eresource.trial')).toBeInTheDocument();
  });
});
