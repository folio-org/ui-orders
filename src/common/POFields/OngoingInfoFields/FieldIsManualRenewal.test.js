import React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'react-final-form';

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
});
