import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldAutomaticExport from './FieldAutomaticExport';

const renderFieldAutomaticExport = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldAutomaticExport
        {...props}
      />
    )}
  />,
);

describe('FieldAutomaticExport', () => {
  it('should render \'Automatic export\' field', () => {
    renderFieldAutomaticExport();

    expect(screen.getByText('ui-orders.poLine.automaticExport')).toBeInTheDocument();
  });
});
