import { Form } from 'react-final-form';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { arrayMutators } from 'fixtures/arrayMutatorsMock';
import VendorForm from './VendorForm';

const defaultProps = {
  accounts: [{
    name: 'name',
    accountNo: 'accountNo',
  }],
  order: {
    workflowStatus: 'Pending',
  },
};

const renderVendorForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    mutators={{
      ...arrayMutators,
    }}
    render={() => (
      <VendorForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
);

describe('VendorForm', () => {
  it('should render \'vendor form\' fields', () => {
    renderVendorForm();

    expect(screen.getByText('stripes-acq-components.referenceNumbers.addReferenceNumbers')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.vendor.accountNumber')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.vendor.instructions')).toBeInTheDocument();
  });

  it('should render active account numbers', () => {
    const accounts = [
      {
        name: 'name',
        accountNo: '1',
        accountStatus: 'Active',
      },
      {
        name: 'name2',
        accountNo: '2',
        accountStatus: 'Inactive',
      },
      {
        name: 'name3',
        accountNo: '3',
        accountStatus: 'Active',
      },
    ];

    renderVendorForm({ accounts });

    expect(screen.getByText(`${accounts[0].name} (${accounts[0].accountNo})`)).toBeInTheDocument();
    expect(screen.getByText(`${accounts[2].name} (${accounts[2].accountNo})`)).toBeInTheDocument();
  });
});
