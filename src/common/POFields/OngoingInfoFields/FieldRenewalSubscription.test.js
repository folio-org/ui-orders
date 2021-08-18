import React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

import FieldRenewalSubscription from './FieldRenewalSubscription';

const renderFieldRenewalSubscription = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldRenewalSubscription
        {...props}
      />
    )}
  />,
);

describe('FieldRenewalSubscription', () => {
  it('should render subscription field with label and checkbox', async () => {
    const { getByText, findByRole } = renderFieldRenewalSubscription();

    const checkbox = await findByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(getByText('ui-orders.renewals.subscription')).toBeInTheDocument();
  });
});
