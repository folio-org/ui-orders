import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldSelector from './FieldSelector';

const renderFieldSelector = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldSelector
        {...props}
      />
    )}
  />,
);

describe('FieldSelector', () => {
  it('should render \'selector\' field', () => {
    renderFieldSelector();

    expect(screen.getByText('ui-orders.poLine.selector')).toBeInTheDocument();
  });
});
