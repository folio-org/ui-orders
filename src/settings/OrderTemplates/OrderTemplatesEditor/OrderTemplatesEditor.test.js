import { QueryClient, QueryClientProvider } from 'react-query';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  HasCommand,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';

import OrderTemplatesEditor from './OrderTemplatesEditor';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
  Layer: jest.fn(({ children }) => <>{children}</>),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  EditCustomFieldsRecord: jest.fn().mockImplementation(({ accordionId }) => {
    if (accordionId === 'poCustomFields') {
      return <div>EditCustomFieldsRecord_PO</div>;
    } else if (accordionId === 'polCustomFields') {
      return <div>EditCustomFieldsRecord_POL</div>;
    }

    return <div>EditCustomFieldsRecord</div>;
  }),
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

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

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
  { wrapper },
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
      expect(screen.getByText('EditCustomFieldsRecord_PO')).toBeInTheDocument();
      expect(screen.getByText('EditCustomFieldsRecord_POL')).toBeInTheDocument();
    });
  });

  describe('OrderTemplatesEditor shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      defaultProps.close.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', () => {
      renderOrderTemplatesEditor();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderOrderTemplatesEditor();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should call close when cancel shortcut is called', () => {
      renderOrderTemplatesEditor();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.close).toHaveBeenCalled();
    });
  });
});
