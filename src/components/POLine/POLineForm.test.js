import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Form } from 'react-final-form';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  collapseAllSections,
  expandAllSections,
  HasCommand,
} from '@folio/stripes/components';
import {
  ORDER_TYPES,
  useFunds,
  useInstanceHoldingsQuery,
} from '@folio/stripes-acq-components';

import {
  location,
  order,
} from 'fixtures';
import POLineForm from './POLineForm';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/AcqUnitsField', () => {
  return () => <span>AcqUnitsField</span>;
});
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  Donors: jest.fn(() => 'Donors'),
  useFunds: jest.fn(),
  useInstanceHoldingsQuery: jest.fn(),
}));
jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  EditCustomFieldsRecord: jest.fn(props => {
    props.onComponentLoad();

    return 'EditCustomFieldsRecord';
  }),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('./Location/LocationForm', () => jest.fn().mockReturnValue('LocationForm'));
jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useManageDonorOrganizationIds: jest.fn().mockReturnValue({
    donorOrganizationIds: [],
    setDonorIds: jest.fn(),
    onDonorRemove: jest.fn(),
  }),
}));

const defaultProps = {
  onCancel: jest.fn(),
  form: {
    change: jest.fn(),
    batch: jest.fn(),
    getRegisteredFields: jest.fn(),
  },
  initialValues: {
    donorOrganizationIds: [],
    fundDistribution: [],
  },
  onSubmit: jest.fn(),
  handleSubmit: jest.fn(),
  pristine: false,
  submitting: false,
  isSaveAndOpenButtonVisible: true,
  enableSaveBtn: true,
  order: {
    ...order,
    workflowStatus: 'Pending',
    template: 'templateId',
  },
  parentResources: {
    createInventory: {
      records: [{}],
    },
    identifierTypes: {
      records: [{
        id: 'id',
        name: 'ISBN',
      }],
    },
    contributorNameTypes: {
      records: [{
        name: 'name',
        id: 'id',
      }],
    },
    locations: {
      records: [{
        id: 'locationId',
      }],
    },
    materialTypes: {
      records: [{
        records: [{
          id: 'id',
          name: 'name',
        }],
      }],
    },
    orderTemplates: {
      records: [{
        id: 'templateId',
        label: 'label',
        templateName: 'templateName',
        templateCode: 'templateCode',
        locations: [{
          locationId: 'locationId',
        }],
        hiddenFields: { isPackage: true },
      }],
    },
  },
  toggleCreateAnother: jest.fn(),
  isCreateAnotherChecked: false,
  linesLimit: 3,
  values: {
    orderFormat: 'P/E Mix',
    donorOrganizationIds: [],
    fundDistribution: [],
  },
  stripes: {},
};

const holdings = [
  {
    id: 'holding-id',
    permanentLocationId: location.id,
  },
];

const funds = [
  {
    id: 'fund-id-1',
    restrictByLocations: true,
    locationIds: [location.id],
  },
  {
    id: 'fund-id-2',
    restrictByLocations: false,
  },
];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderPOLineForm = (props = {}) => render(
  <Form
    onSubmit={jest.fn}
    render={() => (
      <POLineForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper },
);

describe('POLineForm', () => {
  beforeEach(() => {
    defaultProps.form.change.mockClear();
    useFunds
      .mockClear()
      .mockReturnValue({ funds });
    useInstanceHoldingsQuery
      .mockClear()
      .mockReturnValue({ holdings });
  });

  it('should render form items', async () => {
    renderPOLineForm();

    await waitFor(() => {
      expect(screen.getByText('ui-orders.line.accordion.itemDetails')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.accordion.details')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.accordion.vendor')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.accordion.cost')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.accordion.fund')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.accordion.donorInformation')).toBeInTheDocument();
      expect(screen.getByText(/LocationForm/i)).toBeInTheDocument();
      expect(screen.getByText('EditCustomFieldsRecord')).toBeInTheDocument();
    });
  });

  it('should not render form if initial values undefined', async () => {
    renderPOLineForm({ initialValues: null });

    await waitFor(() => {
      expect(screen.queryByText('ui-orders.line.accordion.itemDetails')).not.toBeInTheDocument();
    });
  });

  it('should render Ongoing order information accordion', async () => {
    renderPOLineForm({ ...defaultProps, order: { ...order, orderType: ORDER_TYPES.ongoing } });

    await waitFor(() => {
      expect(screen.getByText('ui-orders.line.accordion.ongoingOrder')).toBeInTheDocument();
    });
  });

  it('should render \'Create another\' checkbox', async () => {
    renderPOLineForm();

    await waitFor(() => {
      expect(screen.getByText('ui-orders.buttons.line.createAnother')).toBeInTheDocument();
    });
  });

  it('should not render \'Create another\' checkbox', async () => {
    renderPOLineForm({ isCreateFromInstance: true });

    await waitFor(() => {
      expect(screen.queryByText('ui-orders.buttons.line.createAnother')).not.toBeInTheDocument();
    });
  });
});

describe('POLineForm shortcuts', () => {
  beforeEach(() => {
    HasCommand.mockClear();
  });

  it('should call expandAllSections when expandAllSections shortcut is called', async () => {
    renderPOLineForm();

    HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

    expect(expandAllSections).toHaveBeenCalled();
  });

  it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
    renderPOLineForm();

    HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

    expect(collapseAllSections).toHaveBeenCalled();
  });

  it('should cancel form when cancel shortcut is called', () => {
    const pushMock = jest.fn();

    useHistory.mockClear().mockReturnValue({
      push: pushMock,
    });

    renderPOLineForm();
    HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should navigate to list view when search shortcut is called', () => {
    const pushMock = jest.fn();

    useHistory.mockClear().mockReturnValue({
      push: pushMock,
    });

    renderPOLineForm();
    HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

    expect(pushMock).toHaveBeenCalled();
  });
});

describe('POLineForm actions', () => {
  it('should show hidden fields when \'Show hidden fields\' btn was clicked', async () => {
    renderPOLineForm();

    const toggleFieldsVisibility = await screen.findByTestId('toggle-fields-visibility');

    expect(screen.queryByRole('checkbox', {
      name: 'ui-orders.poLine.package',
    })).not.toBeInTheDocument();

    await user.click(toggleFieldsVisibility);

    const field = screen.getByRole('checkbox', { name: 'ui-orders.poLine.package' });

    expect(field).toBeInTheDocument();
  });
});
