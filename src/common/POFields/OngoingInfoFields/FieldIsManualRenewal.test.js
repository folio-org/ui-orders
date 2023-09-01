import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import FieldIsManualRenewal from './FieldIsManualRenewal';

const renderFieldIsManualRenewal = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <FieldIsManualRenewal
        {...props}
      />
    )}
  />,
);

describe('FieldIsManualRenewal', () => {
  it('should render manual renewal field with label and checkbox', async () => {
    const { getByText, findByRole } = renderFieldIsManualRenewal();

    const checkbox = await findByRole('checkbox');

    expect(checkbox).toBeInTheDocument();
    expect(getByText('ui-orders.renewals.manualRenewal')).toBeInTheDocument();
  });

  it('should render manual renewal field tooltip if field is disabled', () => {
    renderFieldIsManualRenewal({ disabled: true });

    expect(screen.getByText('ui-orders.renewals.manualRenewal.tooltip')).toBeInTheDocument();
  });
});
