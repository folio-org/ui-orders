import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldRenewalPeriod from './FieldRenewalPeriod';

const renderFieldRenewalPeriod = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldRenewalPeriod
        {...props}
      />
    )}
  />,
);

describe('FieldRenewalPeriod', () => {
  it('should render renewal period field', async () => {
    renderFieldRenewalPeriod();

    expect(screen.getByText('ui-orders.renewals.reviewPeriod')).toBeInTheDocument();
  });
});
