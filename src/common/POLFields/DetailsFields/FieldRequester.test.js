import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldRequester from './FieldRequester';

const renderFieldRequester = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldRequester
        {...props}
      />
    )}
  />,
);

describe('FieldRequester', () => {
  it('should render \'requester\' field', () => {
    renderFieldRequester();

    expect(screen.getByText('ui-orders.poLine.requester')).toBeInTheDocument();
  });
});
