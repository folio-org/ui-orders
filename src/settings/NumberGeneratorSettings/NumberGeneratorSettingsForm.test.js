import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
  within,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import NumberGeneratorSettingsForm from './NumberGeneratorSettingsForm';

jest.mock('@folio/stripes/core', () => ({
  useStripes: jest.fn(),
}));

const onSubmitMock = jest.fn();

const renderComponent = () => render(
  <MemoryRouter>
    <NumberGeneratorSettingsForm
      initialValues={{}}
      onSubmit={(values) => onSubmitMock(values)}
    />
  </MemoryRouter>,
);

beforeEach(() => {
  renderComponent();
});

describe('Rendering NumberGeneratorSettingsForm', () => {
  it('should show headline and info text', () => {
    expect(screen.getByText('ui-orders.settings.numberGenerator.options')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.settings.numberGenerator.info')).toBeInTheDocument();
  });

  it('should show receiving accordion and save button', () => {
    expect(screen.getByRole('button', { name: 'Icon ui-orders.settings.numberGenerator.receiving' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'stripes-core.button.save' })).toBeInTheDocument();
  });

  it('should show all form fields', () => {
    expect(screen.getByRole('combobox', { name: 'ui-orders.settings.numberGenerator.barcode' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'ui-orders.settings.numberGenerator.accessionNumber' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'ui-orders.settings.numberGenerator.callNumber' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'ui-orders.settings.numberGenerator.accessionNumberEqualCallNumber' })).toBeInTheDocument();
  });
});

describe('Selecting barcode `onEditable`', () => {
  it('should enable submit button', async () => {
    const saveButton = screen.getByRole('button', { name: 'stripes-core.button.save' });
    const barcodeSelect = screen.getByRole('combobox', { name: 'ui-orders.settings.numberGenerator.barcode' });

    expect(saveButton).toBeDisabled();

    await userEvent.selectOptions(barcodeSelect, ['ui-orders.settings.numberGenerator.options.onEditable']);
    expect(saveButton).toBeEnabled();
  });
});

describe('Selecting number generator `off` for accessionNumber', () => {
  it('should disable accessionNumberEqualCallNumber-checkbox and show warning', async () => {
    const useEqualNumberCheckbox = screen.getByRole('checkbox', { name: 'ui-orders.settings.numberGenerator.accessionNumberEqualCallNumber' });
    const accessionNumberSelect = screen.getByRole('combobox', { name: 'ui-orders.settings.numberGenerator.accessionNumber' });

    expect(useEqualNumberCheckbox).toBeEnabled();

    await userEvent.selectOptions(accessionNumberSelect, ['ui-orders.settings.numberGenerator.options.off']);
    expect(useEqualNumberCheckbox).toBeDisabled();
    expect(screen.getByText('ui-orders.settings.numberGenerator.accessionNumberEqualCallNumber.warning')).toBeInTheDocument();
  });
});

describe('Selecting number generator `off` for callNumber', () => {
  it('should disable accessionNumberEqualCallNumber-checkbox and show warning', async () => {
    const useEqualNumberCheckbox = screen.getByRole('checkbox', { name: 'ui-orders.settings.numberGenerator.accessionNumberEqualCallNumber' });
    const callNumberSelect = screen.getByRole('combobox', { name: 'ui-orders.settings.numberGenerator.callNumber' });

    expect(useEqualNumberCheckbox).toBeEnabled();

    await userEvent.selectOptions(callNumberSelect, ['ui-orders.settings.numberGenerator.options.off']);
    expect(useEqualNumberCheckbox).toBeDisabled();
    expect(screen.getByText('ui-orders.settings.numberGenerator.accessionNumberEqualCallNumber.warning')).toBeInTheDocument();
  });
});

describe('Clicking accessionNumberEqualCallNumber-checkbox', () => {
  it('should disable `off`-option of callNumber and accessionNumber', async () => {
    const accessionNumberSelect = screen.getByRole('combobox', { name: 'ui-orders.settings.numberGenerator.accessionNumber' });
    const accessionNumberSelectOff = within(accessionNumberSelect).getByRole('option', { name: 'ui-orders.settings.numberGenerator.options.off' });
    const callNumberSelect = screen.getByRole('combobox', { name: 'ui-orders.settings.numberGenerator.callNumber' });
    const callNumberSelectOff = within(callNumberSelect).getByRole('option', { name: 'ui-orders.settings.numberGenerator.options.off' });

    expect(accessionNumberSelectOff).toBeEnabled();
    expect(callNumberSelectOff).toBeEnabled();

    const useEqualNumberCheckbox = screen.getByRole('checkbox', { name: 'ui-orders.settings.numberGenerator.accessionNumberEqualCallNumber' });

    await userEvent.click(useEqualNumberCheckbox);
    expect(accessionNumberSelectOff).toBeDisabled();
    expect(callNumberSelectOff).toBeDisabled();
  });
});
