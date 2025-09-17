import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import { order } from 'fixtures';
import { POL_FORM_FIELDS } from '../../../common/constants';
import { usePOLinePiecesExistence } from '../hooks';
import LocationForm from './LocationForm';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Loading: () => 'Loading',
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  FieldInventoryComponent: () => 'FieldInventoryComponent',
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  usePOLinePiecesExistence: jest.fn(),
}));

const initialValues = {
  [POL_FORM_FIELDS.isPackage]: false,
  [POL_FORM_FIELDS.checkinItems]: false,
  [POL_FORM_FIELDS.locations]: [
    {
      locationId: 'test-location-id',
      quantityPhysical: 1,
      quantityElectronic: 1,
      quantity: 2,
    },
  ],
};

const defaultProps = {
  change: jest.fn(),
  changeLocation: jest.fn(),
  formValues: { ...initialValues },
  locationIds: [],
  locations: [{ id: 'test-location-id', name: 'test-location-name' }],
  order,
};

const Form = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const renderLocationForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    initialValues={initialValues}
  >
    <LocationForm
      {...defaultProps}
      {...props}
    />
  </Form>,
  { wrapper: MemoryRouter },
);

describe('LocationForm', () => {
  beforeEach(() => {
    usePOLinePiecesExistence.mockReturnValue({
      isExist: false,
      isFetching: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loader when data is loading', () => {
    renderLocationForm({ isLoading: true });

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('should render \'location form\' fields', () => {
    renderLocationForm();

    expect(screen.getByText('stripes-acq-components.location.label')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.location.quantityPhysical')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.location.quantityElectronic')).toBeInTheDocument();
  });

  it('should display warning banner when pending PO Line with synchronized workflow has received pieces', () => {
    usePOLinePiecesExistence.mockReturnValue({ isExist: true });

    renderLocationForm({
      order: {
        ...order,
        workflowStatus: ORDER_STATUSES.pending,
      },
    });

    expect(screen.getByText('ui-orders.cost.quantityPopover')).toBeInTheDocument();
  });
});
