import React from 'react';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';

import POLineVendorForm from './POLineVendorForm';
import { arrayMutators } from '../../../../../test/jest/arrayMutatorsMock';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  VendorReferenceNumbersFields: jest.fn().mockReturnValue('VendorReferenceNumbersFields'),
}));

const renderPOLineVendorForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    mutators={{ ...arrayMutators }}
    render={() => (
      <POLineVendorForm
        {...props}
      />
    )}
  />,
);

describe('POLineVendorForm', () => {
  it('should render \'POLine vendor form\' fields', () => {
    renderPOLineVendorForm();

    expect(screen.getByText('VendorReferenceNumbersFields')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.vendor.accountNumber')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.vendor.instructions')).toBeInTheDocument();
  });
});
