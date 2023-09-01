import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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

  it('should render renewal period field tooltip if field is disabled', async () => {
    renderFieldRenewalPeriod({ disabled: true });

    expect(screen.getByText(/tooltip/i)).toBeInTheDocument();
  });
});
