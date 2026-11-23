import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  MemoryRouter,
  useHistory,
} from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
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
  orderLine,
} from 'fixtures';
import { SUBMIT_ACTION_FIELD } from '../../common/constants';
import { DeprecatedAcqMethodsOpenOrderModal } from '../../common/DeprecatedAcqMethodsOpenOrderModal';
import { useDeprecatedAcqMethods } from '../../common/hooks';
import { SUBMIT_ACTION } from './const';
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
const mockCollapseAll = jest.fn();

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useAccordionErrorTrigger: jest.fn(() => ({
    onToggle: jest.fn(),
    onExpandAllToggle: jest.fn(),
    collapseAll: mockCollapseAll,
  })),
  useDeprecatedAcqMethods: jest.fn(() => ({ deprecatedAcqMethods: [] })),
}));
jest.mock('../../common/DeprecatedAcqMethodsOpenOrderModal', () => ({
  DeprecatedAcqMethodsOpenOrderModal: jest.fn(({ onCancel, onSubmit }) => (
    <div>
      DeprecatedAcqMethodsOpenOrderModal
      <button type="button" onClick={onCancel}>cancel open</button>
      <button type="button" onClick={onSubmit}>submit open</button>
    </div>
  )),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  EditCustomFieldsRecord: jest.fn(() => 'EditCustomFieldsRecord'),
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
  enableSaveBtn: true,
  initialValues: {
    donorOrganizationIds: [],
    fundDistribution: [],
  },
  isSaveAndOpenButtonVisible: true,
  linesLimit: 3,
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  order: {
    ...order,
    workflowStatus: 'Pending',
    template: 'templateId',
  },
  stripes: {},
  templateValue: {
    id: 'templateId',
    label: 'label',
    locations: [{
      locationId: 'locationId',
    }],
    templateCode: 'templateCode',
    templateName: 'templateName',
    hiddenFields: { isPackage: true },
  },
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
  <POLineForm
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('POLineForm', () => {
  beforeEach(() => {
    useFunds.mockReturnValue({ funds });
    useInstanceHoldingsQuery.mockReturnValue({ holdings });
  });

  afterEach(() => {
    jest.clearAllMocks();
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
      expect(screen.getByText('ui-orders.buttons.line.saveAndCreateAnother')).toBeInTheDocument();
    });
  });

  it('should not render \'Create another\' checkbox', async () => {
    renderPOLineForm({ isCreateFromInstance: true });

    await waitFor(() => {
      expect(screen.queryByText('ui-orders.buttons.line.saveAndCreateAnother')).not.toBeInTheDocument();
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

  it('should call collapseAll when collapseAllSections shortcut is called', () => {
    renderPOLineForm();

    HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

    expect(mockCollapseAll).toHaveBeenCalled();
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

describe('POLineForm "Save & open" with deprecated acquisition methods', () => {
  const otherLine = { id: 'other-line-id', acquisitionMethod: 'deprecated-method-id' };
  const lastLine = { id: 'last-line-id', acquisitionMethod: 'deprecated-method-id' };
  const orderWithLines = {
    ...defaultProps.order,
    poLines: [otherLine, orderLine, lastLine],
  };

  // Without metadata, which needs a stripes object with okapi to be rendered
  const line = { ...orderLine, metadata: undefined };

  const renderLineForm = () => renderPOLineForm({ initialValues: line, order: orderWithLines });
  const clickSaveAndOpen = () => user.click(screen.getByTestId('button-save-and-open'));

  const mockDeprecatedAcqMethods = () => useDeprecatedAcqMethods.mockReturnValue({
    deprecatedAcqMethods: [{ id: 'deprecated-method-id', deprecated: true }],
  });

  beforeEach(() => {
    useFunds.mockReturnValue({ funds });
    useInstanceHoldingsQuery.mockReturnValue({ holdings });
  });

  afterEach(() => {
    jest.clearAllMocks();
    useDeprecatedAcqMethods.mockReturnValue({ deprecatedAcqMethods: [] });
  });

  it('should check the order lines with the edited line as it is in the form', () => {
    renderPOLineForm({ initialValues: { ...line, acquisitionMethod: 'edited-method-id' }, order: orderWithLines });

    // The edited line keeps its position, so that the warning lists the line numbers in order
    expect(useDeprecatedAcqMethods).toHaveBeenLastCalledWith([
      otherLine,
      expect.objectContaining({ id: line.id, acquisitionMethod: 'edited-method-id' }),
      lastLine,
    ]);
  });

  it('should save and open the order right away when no deprecated methods are used', async () => {
    renderLineForm();

    await clickSaveAndOpen();

    expect(screen.queryByText('DeprecatedAcqMethodsOpenOrderModal')).not.toBeInTheDocument();
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ [SUBMIT_ACTION_FIELD]: SUBMIT_ACTION.saveAndOpen }),
    );
  });

  it('should ask for confirmation with the deprecated methods before saving', async () => {
    mockDeprecatedAcqMethods();
    renderLineForm();

    await clickSaveAndOpen();

    const { deprecatedAcqMethods, orderNumber } = DeprecatedAcqMethodsOpenOrderModal.mock.lastCall[0];

    expect(screen.getByText('DeprecatedAcqMethodsOpenOrderModal')).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    expect(orderNumber).toBe(orderWithLines.poNumber);
    expect(deprecatedAcqMethods).toBe(useDeprecatedAcqMethods.mock.results.at(-1).value.deprecatedAcqMethods);
  });

  it('should save and open the order when the user confirms', async () => {
    mockDeprecatedAcqMethods();
    renderLineForm();

    await clickSaveAndOpen();
    await user.click(screen.getByText('submit open'));

    expect(screen.queryByText('DeprecatedAcqMethodsOpenOrderModal')).not.toBeInTheDocument();
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ [SUBMIT_ACTION_FIELD]: SUBMIT_ACTION.saveAndOpen }),
    );
  });

  it('should not open the order with the save shortcut after the user cancelled', async () => {
    mockDeprecatedAcqMethods();
    renderLineForm();

    await clickSaveAndOpen();
    await user.click(screen.getByText('cancel open'));
    await user.type(screen.getByRole('textbox', { name: /edition/i }), ' updated');
    HasCommand.mock.calls.at(-1)[0].commands.find(c => c.name === 'save').handler();

    await waitFor(() => expect(defaultProps.onSubmit).toHaveBeenCalled());
    expect(defaultProps.onSubmit).not.toHaveBeenCalledWith(
      expect.objectContaining({ [SUBMIT_ACTION_FIELD]: SUBMIT_ACTION.saveAndOpen }),
    );
  });

  it('should only show the validation errors for an invalid form', async () => {
    mockDeprecatedAcqMethods();
    renderPOLineForm({ initialValues: { ...line, titleOrPackage: '' }, order: orderWithLines });

    await clickSaveAndOpen();

    expect(screen.queryByText('DeprecatedAcqMethodsOpenOrderModal')).not.toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should neither save nor open the order when the user cancels', async () => {
    mockDeprecatedAcqMethods();
    renderLineForm();

    await clickSaveAndOpen();
    await user.click(screen.getByText('cancel open'));

    expect(screen.queryByText('DeprecatedAcqMethodsOpenOrderModal')).not.toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });
});
