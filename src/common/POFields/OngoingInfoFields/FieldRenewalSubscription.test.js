import { Form } from 'react-final-form';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
    renderFieldRenewalSubscription();

    const checkbox = await screen.findByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.subscription')).toBeInTheDocument();
  });

  it('should render subscription field tooltip if it disabled', () => {
    renderFieldRenewalSubscription({ disabled: true });

    expect(screen.getByText('ui-orders.renewals.subscription.tooltip')).toBeInTheDocument();
  });

  it('should update clicked checkbox', async () => {
    renderFieldRenewalSubscription();

    const checkbox = await screen.findByRole('checkbox');

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
