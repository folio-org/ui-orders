import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { Form } from 'react-final-form';
import { MemoryRouter } from 'react-router-dom';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import POForm from './POForm';
import getOrderTemplateValue from '../Utils/getOrderTemplateValue';
import { history } from '../../../test/jest/routerMocks';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('../Utils/getOrderTemplateValue', () => jest.fn().mockReturnValue({}));
jest.mock('./PODetails/PODetailsForm', () => jest.fn().mockReturnValue('PODetailsForm'));
jest.mock('./OngoingOgderInfo/OngoingInfoForm', () => jest.fn().mockReturnValue('OngoingInfoForm'));
jest.mock('./Summary/SummaryForm', () => jest.fn().mockReturnValue('SummaryForm'));

const defaultProps = {
  values: {},
  generatedNumber: '1000',
  initialValues: {},
  pristine: false,
  submitting: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  change: jest.fn(),
  handleSubmit: jest.fn(),
  parentResources: {
    orderTemplates: {
      records: [{
        id: 'templateId',
        label: 'label',
        templateName: 'templateName',
        templateCode: 'templateCode',
        locations: [{
          locationId: 'locationId',
        }],
      }],
    },
  },
  form: {
    change: jest.fn(),
    batch: jest.fn(),
    getRegisteredFields: jest.fn(),
  },
  parentMutator: {},
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
  it('should render \'PO form\' fields', () => {
    renderPOForm();

    expect(screen.getByText('ui-orders.settings.orderTemplates.editor.template.name')).toBeInTheDocument();
    expect(screen.getByText(/PODetailsForm/i)).toBeInTheDocument();
    expect(screen.getByText(/OngoingInfoForm/i)).toBeInTheDocument();
    expect(screen.getByText(/SummaryForm/i)).toBeInTheDocument();
  });

  it('should change template when another selected', async () => {
    renderPOForm();

    const select = await screen.findByLabelText('ui-orders.settings.orderTemplates.editor.template.name');

    user.click(select);

    const options = await screen.findAllByRole('option');

    user.click(options[1]);
    expect(getOrderTemplateValue).toHaveBeenCalled();
  });
});

describe('POForm shortcuts', () => {
  beforeEach(() => {
    HasCommand.mockClear();
    expandAllSections.mockClear();
    collapseAllSections.mockClear();
  });

  it('should call expandAllSections when expandAllSections shortcut is called', () => {
    renderPOForm();

    HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

    expect(expandAllSections).toHaveBeenCalled();
  });

  it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
    renderPOForm();

    HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

    expect(collapseAllSections).toHaveBeenCalled();
  });
});
