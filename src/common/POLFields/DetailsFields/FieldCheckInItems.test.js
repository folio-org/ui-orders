import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldCheckInItems from './FieldCheckInItems';

const renderFieldCheckInItems = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldCheckInItems
        {...props}
      />
    )}
  />,
);

describe('FieldCheckInItems', () => {
  it('should render \'check-in items\' field', () => {
    renderFieldCheckInItems();

    expect(screen.getByText('ui-orders.poLine.receiveItems')).toBeInTheDocument();
  });
});
