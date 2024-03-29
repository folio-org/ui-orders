import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldRenewalInterval from './FieldRenewalInterval';

const renderFieldRenewalInterval = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldRenewalInterval
        {...props}
      />
    )}
  />,
);

describe('FieldRenewalInterval', () => {
  it('should render renewal interval field', async () => {
    renderFieldRenewalInterval();

    expect(screen.getByText('ui-orders.renewals.renewalInterval')).toBeInTheDocument();
  });

  it('should render renewal interval field tooltip if field is disabled', async () => {
    renderFieldRenewalInterval({ disabled: true });

    expect(screen.getByText('ui-orders.renewals.manualRenewal.tooltip')).toBeInTheDocument();
  });
});
