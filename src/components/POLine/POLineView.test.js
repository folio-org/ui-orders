import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { ORDER_TYPES } from '@folio/stripes-acq-components';

import POLineView from './POLineView';
import { history, location, match } from '../../../test/jest/routerMocks';
import { orderLine, order } from '../../../test/jest/fixtures';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useModalToggle: jest.fn().mockReturnValue([false, jest.fn((state) => !state)]),
  useAcqRestrictions: jest.fn().mockReturnValue({
    isLoading: false,
    restrictions: {
      protectUpdate: false,
      protectDelete: false,
    },
  }),
  FundDistributionView: jest.fn(() => 'FundDistributionView'),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  NotesSmartAccordion: jest.fn().mockReturnValue('NotesSmartAccordion'),
  ViewMetaData: jest.fn().mockReturnValue('ViewMetaData'),
}));
jest.mock('./Cost/CostView', () => jest.fn().mockReturnValue('CostView'));
jest.mock('./Location/LocationView', () => jest.fn().mockReturnValue('LocationView'));
jest.mock('./Physical/PhysicalView', () => jest.fn().mockReturnValue('PhysicalView'));
jest.mock('./Eresources/EresourcesView', () => jest.fn().mockReturnValue('EresourcesView'));
jest.mock('./RelatedInvoiceLines', () => ({
  RelatedInvoiceLines: jest.fn().mockReturnValue('RelatedInvoiceLines'),
}));
jest.mock('./Vendor/VendorView', () => jest.fn().mockReturnValue('VendorView'));
jest.mock('./Other', () => ({
  OtherView: jest.fn().mockReturnValue('OtherView'),
}));
jest.mock('./POLineAgreementLines', () => ({
  POLineAgreementLinesContainer: jest.fn().mockReturnValue('POLineAgreementLinesContainer'),
}));
jest.mock('./LineLinkedInstances', () => ({
  LineLinkedInstances: jest.fn().mockReturnValue('LineLinkedInstances'),
}));

const defaultProps = {
  line: orderLine,
  order,
  editable: true,
  goToOrderDetails: jest.fn(),
  tagsToggle: jest.fn(),
  deleteLine: jest.fn(),
  onClose: jest.fn(),
  materialTypes: [{
    label: 'label',
    value: 'value',
  }],
  locations: [],
  location,
  history,
  match,
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

const renderPOLineView = (props = {}) => render(
  <POLineView
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('POLineView', () => {
  it('should render PO Line view', async () => {
    renderPOLineView();

    expect(screen.getByText(/CostView/i)).toBeInTheDocument();
    expect(screen.getByText(/LocationView/i)).toBeInTheDocument();
    expect(screen.getByText(/PhysicalView/i)).toBeInTheDocument();
    expect(screen.getByText(/EresourcesView/i)).toBeInTheDocument();
    expect(screen.getByText(/RelatedInvoiceLines/i)).toBeInTheDocument();
    expect(screen.getByText(/VendorView/i)).toBeInTheDocument();
    expect(screen.getByText(/POLineAgreementLinesContainer/i)).toBeInTheDocument();
    expect(screen.getByText(/LineLinkedInstances/i)).toBeInTheDocument();
    expect(screen.getByText(/NotesSmartAccordion/i)).toBeInTheDocument();
    expect(screen.getByText(/ViewMetaData/i)).toBeInTheDocument();
  });

  it('should render Ongoing order information accordion', async () => {
    renderPOLineView({ ...defaultProps, order: { ...order, orderType: ORDER_TYPES.ongoing } });

    expect(screen.getByText('ui-orders.line.accordion.ongoingOrder')).toBeInTheDocument();
  });

  it('should go to order details when corresponding button was pressed', async () => {
    renderPOLineView();

    const goToBtn = await screen.findByTestId('line-details-actions-view-po');

    user.click(goToBtn);

    expect(defaultProps.goToOrderDetails).toHaveBeenCalled();
  });

  it('should not render change instance button for pending order', async () => {
    renderPOLineView();

    expect(screen.queryByText('ui-orders.buttons.line.changeInstance')).toBeNull();
  });
});
