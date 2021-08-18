import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldRenewalDate from './FieldRenewalDate';

const renderFieldRenewalDate = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldRenewalDate
        {...props}
      />
    )}
  />,
);

describe('FieldRenewalDate', () => {
  it('should render renewal date field', async () => {
    renderFieldRenewalDate();

    expect(screen.getByText('ui-orders.renewals.renewalDate')).toBeInTheDocument();
  });
});
