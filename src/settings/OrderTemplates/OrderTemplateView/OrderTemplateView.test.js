import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import OrderTemplateView from './OrderTemplateView';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Layer: jest.fn(({ children }) => <>{children}</>),
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

const defaultProps = {
  close: jest.fn(),
  onDelete: jest.fn(),
  orderTemplate: {
    id: 'id',
    templateName: 'templateName',
  },
  rootPath: '',
  addresses: [],
  locations: [],
  materialTypes: [],
};

const renderOrderTemplateView = (props = {}) => render(
  <OrderTemplateView
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
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
  });

  it('should delete template when delete button was pressed', async () => {
    renderOrderTemplateView();

    const btns = await screen.findAllByRole('button');

    user.click(btns[1]);

    const deleteBtn = await screen.findByTestId('view-order-template-action-delete');

    user.click(deleteBtn);
    user.click(screen.getByText('ui-orders.settings.orderTemplates.confirmDelete.confirmLabel'))

    expect(defaultProps.onDelete).toHaveBeenCalled();
  });
});
