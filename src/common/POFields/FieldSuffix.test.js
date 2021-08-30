import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldSuffix from './FieldSuffix';

const defaultProps = {
  suffixes: [],
};

const renderFieldSuffix = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldSuffix
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('FieldSuffix', () => {
  it('should render \'suffix\' field', () => {
    renderFieldSuffix();

    expect(screen.getByText('ui-orders.orderDetails.orderNumberSuffix')).toBeInTheDocument();
  });
});
