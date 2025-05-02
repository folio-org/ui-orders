import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { history } from 'fixtures/routerMocks';
import OrderTemplateView from './OrderTemplateView';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Layer: jest.fn(({ children }) => <>{children}</>),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewCustomFieldsRecord: jest.fn().mockReturnValue('ViewCustomFieldsRecord'),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewCustomFieldsRecord: jest.fn().mockImplementation(({ accordionId }) => {
    if (accordionId === 'poCustomFields') {
      return <div>ViewCustomFieldsRecord_PO</div>;
    } else if (accordionId === 'polCustomFields') {
      return <div>ViewCustomFieldsRecord_POL</div>;
    }

    return <div>ViewCustomFieldsRecord</div>;
  }),
}));
jest.mock('./TemplateInformationView', () => jest.fn().mockReturnValue('TemplateInformationView'));
jest.mock('./OrderTemplateTagsView', () => jest.fn().mockReturnValue('OrderTemplateTagsView'));
jest.mock('../../../components/POLine/Cost/CostView', () => jest.fn().mockReturnValue('CostView'));
jest.mock('../../../components/POLine/Vendor/VendorView', () => jest.fn().mockReturnValue('VendorView'));
jest.mock('../../../components/POLine/Item/ItemView', () => jest.fn().mockReturnValue('ItemView'));
jest.mock('../../../components/POLine/Location/LocationView', () => jest.fn().mockReturnValue('LocationView'));
jest.mock('../../../components/POLine/POLineDetails/POLineDetails', () => jest.fn().mockReturnValue('POLineDetails'));
jest.mock('../../../components/PurchaseOrder/PODetails/PODetailsView', () => jest.fn().mockReturnValue('PODetailsView'));
jest.mock('../../../components/PurchaseOrder/Summary/SummaryView', () => jest.fn().mockReturnValue('SummaryView'));

const mockPush = jest.fn();

const defaultProps = {
  close: jest.fn(),
  onDelete: jest.fn(),
  onDuplicate: jest.fn(),
  orderTemplate: {
    id: 'id',
    templateName: 'templateName',
  },
  rootPath: '',
  addresses: [],
  locations: [],
  materialTypes: [],
  history: { ...history, push: mockPush },
  stripes: { hasPerm: jest.fn().mockReturnValue(true) },
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderOrderTemplateView = (props = {}) => render(
  <OrderTemplateView
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('OrderTemplateView', () => {
  it('should render \'order template view\' items', () => {
    renderOrderTemplateView();

    expect(screen.getByText('TemplateInformationView')).toBeInTheDocument();
    expect(screen.getByText('CostView')).toBeInTheDocument();
    expect(screen.getByText('VendorView')).toBeInTheDocument();
    expect(screen.getByText('ItemView')).toBeInTheDocument();
    expect(screen.getByText('LocationView')).toBeInTheDocument();
    expect(screen.getByText('PODetailsView')).toBeInTheDocument();
    expect(screen.getByText('POLineDetails')).toBeInTheDocument();
    expect(screen.getByText('SummaryView')).toBeInTheDocument();
    expect(screen.getByText('ViewCustomFieldsRecord_PO')).toBeInTheDocument();
    expect(screen.getByText('ViewCustomFieldsRecord_POL')).toBeInTheDocument();
  });

  it('should duplicate template when \'Duplicate\' action was performed', async () => {
    renderOrderTemplateView();

    const btns = await screen.findAllByRole('button');

    await user.click(btns[1]);

    const duplicateBtn = await screen.findByTestId('view-order-template-action-duplicate');

    await user.click(duplicateBtn);
    await user.click(screen.getByText('stripes-components.submit'));

    expect(defaultProps.onDuplicate).toHaveBeenCalled();
  });

  it('should delete template when delete button was pressed', async () => {
    renderOrderTemplateView();

    const btns = await screen.findAllByRole('button');

    await user.click(btns[1]);

    const deleteBtn = await screen.findByTestId('view-order-template-action-delete');

    await user.click(deleteBtn);
    await user.click(screen.getByText('ui-orders.settings.orderTemplates.confirmDelete.confirmLabel'));

    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  describe('OrderTemplateView shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
      defaultProps.close.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', () => {
      renderOrderTemplateView();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderOrderTemplateView();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should call close when cancel shortcut is called', () => {
      renderOrderTemplateView();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.close).toHaveBeenCalled();
    });

    it('should navigate to edit form when edit shortcut is called', () => {
      mockPush.mockClear();

      renderOrderTemplateView();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(mockPush).toHaveBeenCalledWith(`${defaultProps.rootPath}/${defaultProps.orderTemplate.id}/edit`);
    });

    it('should open confirm duplicate modal when duplicate shortcut is called', async () => {
      mockPush.mockClear();

      renderOrderTemplateView();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'duplicateRecord').handler();

      expect(await screen.findByText('ui-orders.settings.orderTemplates.confirmDuplicate.heading')).toBeInTheDocument();
    });
  });
});
