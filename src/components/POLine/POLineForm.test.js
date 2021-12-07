import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Form } from 'react-final-form';
import user from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';

import { HasCommand } from '@folio/stripes/components';
import { useAccordionToggle } from '@folio/stripes-acq-components';

import POLineForm from './POLineForm';
import { order } from '../../../test/jest/fixtures';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/AcqUnitsField', () => {
  return () => <span>AcqUnitsField</span>;
});
jest.mock('@folio/stripes-acq-components/lib/hooks/useAccordionToggle', () => ({
  useAccordionToggle: jest.fn().mockReturnValue([jest.fn(), {}, jest.fn()]),
}));
jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('./Location/LocationForm', () => jest.fn().mockReturnValue('LocationForm'));

const defaultProps = {
  onCancel: jest.fn(),
  form: {
    change: jest.fn(),
    batch: jest.fn(),
    getRegisteredFields: jest.fn(),
  },
  initialValues: {},
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
  },
  stripes: {},
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
  });

  it('should render form items', async () => {
    renderPOLineForm();

    await waitFor(() => {
      expect(screen.getByText('ui-orders.line.accordion.itemDetails')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.accordion.details')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.accordion.vendor')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.accordion.cost')).toBeInTheDocument();
      expect(screen.getByText('ui-orders.line.accordion.fund')).toBeInTheDocument();
      expect(screen.getByText(/LocationForm/i)).toBeInTheDocument();
    });
  });

  it('should not render form if initial values undefined', async () => {
    renderPOLineForm({ initialValues: null });

    await waitFor(() => {
      expect(screen.queryByText('ui-orders.line.accordion.itemDetails')).not.toBeInTheDocument();
    });
  });
});

describe('POLineForm shortcuts', () => {
  beforeEach(() => {
    HasCommand.mockClear();
  });

  it('should call expandAllSections when expandAllSections shortcut is called', async () => {
    const expandMock = jest.fn();

    useAccordionToggle.mockClear().mockReturnValue([expandMock, {}, jest.fn()]);

    renderPOLineForm();

    HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

    expect(expandMock).toHaveBeenCalled();
  });

  it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
    const collapseMock = jest.fn();

    useAccordionToggle.mockClear().mockReturnValue([collapseMock, {}, jest.fn()]);

    renderPOLineForm();

    HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

    expect(collapseMock).toHaveBeenCalled();
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

    const showHideBtn = await screen.findByTestId('show-hide-btn');

    expect(screen.queryByRole('checkbox', {
      name: 'ui-orders.poLine.package',
    })).not.toBeInTheDocument();

    user.click(showHideBtn);

    const field = screen.getByRole('checkbox', { name: 'ui-orders.poLine.package' });

    expect(field).toBeInTheDocument();
  });
});
