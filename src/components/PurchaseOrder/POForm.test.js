import { Field, Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen, act } from '@folio/jest-config-stripes/testing-library/react';
import {
  HasCommand,
  collapseAllSections,
  expandAllSections,
} from '@folio/stripes/components';
import { TextField } from '@folio/stripes-acq-components';

import { history } from 'fixtures/routerMocks';
import { ORDER_TYPE } from '../../common/constants';
import PODetailsForm from './PODetails/PODetailsForm';
import POForm from './POForm';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  collapseAllSections: jest.fn(),
  expandAllSections: jest.fn(),
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  EditCustomFieldsRecord: jest.fn().mockReturnValue('EditCustomFieldsRecord'),
}));

jest.mock('./PODetails/PODetailsForm', () => jest.fn().mockReturnValue('PODetailsForm'));
jest.mock('./OngoingOrderInfo/OngoingInfoForm', () => jest.fn().mockReturnValue('OngoingInfoForm'));

const defaultProps = {
  values: {},
  generatedNumber: '1000',
  initialValues: {
    template: 'templateId',
    poNumber: '',
  },
  pristine: false,
  submitting: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  change: jest.fn(),
  handleSubmit: jest.fn(),
  parentResources: {
    orderNumberSetting: {
      records: [{
        value: JSON.stringify({ canUserEditOrderNumber: true }),
      }],
    },
    prefixesSetting: {
      records: [{
        name: 'pref',
      }],
    },
    suffixesSetting: {
      records: [{
        name: 'pref',
      }],
    },
    orderTemplates: {
      records: [{
        id: 'templateId',
        label: 'label',
        templateName: 'templateName',
        templateCode: 'templateCode',
        orderType: ORDER_TYPE.ongoing,
        locations: [{
          locationId: 'locationId',
        }],
        hiddenFields: { ongoing: { isSubscription: true } },
      }],
    },
  },
  form: {
    change: jest.fn(),
    batch: jest.fn(),
    getRegisteredFields: jest.fn(),
  },
  parentMutator: {
    orderNumber: {
      POST: jest.fn(() => Promise.resolve({})),
    },
  },
  history,
};

const renderPOForm = (props = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    render={() => (
      <POForm
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper: MemoryRouter },
);

describe('POForm', () => {
  beforeEach(() => {
    PODetailsForm.mockClear();
  });

  it('should render \'PO form\' fields', () => {
    renderPOForm();

    expect(screen.getByText('ui-orders.settings.orderTemplates.editor.template.name')).toBeInTheDocument();
    expect(screen.getByText(/PODetailsForm/i)).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderSummary.totalUnits')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderSummary.totalEstimatedPrice')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderSummary.approved')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.orderSummary.workflowStatus')).toBeInTheDocument();
    expect(screen.getByText('EditCustomFieldsRecord')).toBeInTheDocument();
  });

  it('should not render Ongoing accordion for non-ongoing order', () => {
    renderPOForm();

    expect(screen.queryByText(/OngoingInfoForm/i)).toBeNull();
  });

  it('should render Ongoing accordion for ongoing order', () => {
    renderPOForm({ initialValues: { orderType: ORDER_TYPE.ongoing } });

    expect(screen.getByText(/OngoingInfoForm/i)).toBeInTheDocument();
  });

  it('should render \'Add POL\' button', () => {
    renderPOForm({ instanceId: 'id' });

    expect(screen.queryByText('ui-orders.paneMenu.addPOLine')).toBeInTheDocument();
  });

  it('should change template when another selected and show hidden fields when \'Show hidden fields\' btn was clicked', async () => {
    renderPOForm();

    const select = await screen.findByLabelText('ui-orders.settings.orderTemplates.editor.template.name');

    await act(async () => user.click(select));

    const options = await screen.findAllByRole('option');

    await act(async () => user.click(options[1]));

    const toggleFieldsVisibility = await screen.findByTestId('toggle-fields-visibility');

    expect(screen.queryByRole('checkbox', {
      name: 'ui-orders.orderSummary.approved',
    })).not.toBeInTheDocument();

    await act(async () => user.click(toggleFieldsVisibility));

    const field = await screen.findByRole('checkbox', {
      name: 'ui-orders.orderSummary.approved',
    });

    expect(field).toBeInTheDocument();
  });

  it('should call validator when \'PO Number\' was changed', async () => {
    PODetailsForm.mockImplementation(({ validateNumber }) => (
      <Field
        component={TextField}
        label="ui-orders.orderDetails.poNumber"
        name="poNumber"
        validate={validateNumber}
      />
    ));

    renderPOForm();

    await user.type(screen.getByLabelText('ui-orders.orderDetails.poNumber'), '777');

    expect(defaultProps.parentMutator.orderNumber.POST).toHaveBeenCalled();
  });
});

describe('POForm shortcuts', () => {
  beforeEach(() => {
    HasCommand.mockClear();
  });

  it('should call expandAllSections when expandAllSections shortcut is called', () => {
    renderPOForm();

    act(() => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler());

    expect(expandAllSections).toHaveBeenCalled();
  });

  it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
    renderPOForm();

    act(() => HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler());

    expect(collapseAllSections).toHaveBeenCalled();
  });
});
