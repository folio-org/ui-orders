import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldIsManualPO from './FieldIsManualPO';

const renderFieldIsManualPO = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldIsManualPO
        {...props}
      />
    )}
  />,
);

describe('FieldIsManualPO', () => {
  it('should render \'is manual\' field', () => {
    renderFieldIsManualPO();

    expect(screen.getByText('ui-orders.orderDetails.manualPO')).toBeInTheDocument();
  });
});
