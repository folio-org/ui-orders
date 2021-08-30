import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import OrderTemplatesEditor from './OrderTemplatesEditor';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Layer: jest.fn(({ children }) => <>{children}</>),
}));

const defaultProps = {
  close: jest.fn(),
  onSubmit: jest.fn(),
  initialValues: {},
  addresses: [],
  values: {
    cost: {
      currency: 'USD',
    },
  },
  locations: [{
    id: 'locationId',
  }],
  identifierTypes: [{
    id: 'typeId',
    name: 'ISBN',
  }],
  contributorNameTypes: [{
    id: 'contributorId',
    name: 'contributorName',
  }],
  fund: [{
    id: 'fundId',
    name: 'fundName',
    code: 'fundCode',
  }],
  createInventory: [{
    value: {},
  }],
  vendors: [{
    isVendor: true,
    status: 'Active',
    accounts: [{
      name: 'accountName',
      accountNo: 'accountNo',
    }],
  }],
  prefixesSetting: [{
    name: 'prefixName',
  }],
  suffixesSetting: [{
    name: 'suffixName',
  }],
  stripes: {
    currency: 'USD',
  },
};

const renderOrderTemplatesEditor = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <OrderTemplatesEditor
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper: MemoryRouter },
);

describe('OrderTemplatesEditor', () => {
  it('should render \'order templates editor\' form fields', async () => {
    renderOrderTemplatesEditor();

    await waitFor(() => {
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.template')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.poInfo')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.poNotes')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.poTags')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.poSummary')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.poItemDetails')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.polDetails')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.polCostDetails')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.polVendor')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.polFundDistribution')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.polLocation')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.settings.orderTemplates.accordion.polTags')).toBeInTheDocument();
    });
  });
});
