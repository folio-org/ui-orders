import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
