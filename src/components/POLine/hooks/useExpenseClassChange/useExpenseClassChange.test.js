import { MemoryRouter } from 'react-router-dom';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import {
  fetchInvoiceLines,
  fetchTransactionById,
  FieldSelectionFinal,
} from '@folio/stripes-acq-components';

import { useExpenseClassChange } from './useExpenseClassChange';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchInvoiceLines: jest.fn(),
  fetchTransactionById: jest.fn(),
}));

const poLineId = 'poLineId';
const encumbrance = {

};

const expenseClassOptions = [
  { value: '1', label: 'Expense class 1' },
  { value: '2', label: 'Expense class 2' },
  { value: '3', label: 'Expense class 3' },
];

const defaultProps = {
  onSubmit: jest.fn(),
  initialValues: {
    fundDistribution: [{
      expenseClassId: 'expenseClassId',
      encumbrance: 'encumbranceId',
    }],
  },
};

const Form = stripesFinalForm({})(({ children }) => {
  const {
    renderModal,
    onExpenseClassChange,
  } = useExpenseClassChange(poLineId);

  const changeExpenseClass = (value) => onExpenseClassChange({
    fieldName: 'fundDistribution[0].expenseClassId',
    parentFieldName: 'fundDistribution[0]',
    value,
  });

  return (
    <form>
      {children}
      <FieldSelectionFinal
        dataOptions={expenseClassOptions}
        name="fundDistribution[0].expenseClassId"
        onChange={changeExpenseClass}
      />
      {renderModal()}
    </form>
  );
});

const renderComponent = (props = {}) => render(
  <Form
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('useExpenseClassChange', () => {
  const kyMock = {
    extend: jest.fn(() => kyMock),
    get: jest.fn(() => ({
      json: jest.fn(() => Promise.resolve({})),
    })),
  };

  beforeEach(() => {
    fetchInvoiceLines.mockReturnValue(jest.fn(() => Promise.resolve({ invoiceLines: [] })));
    fetchTransactionById.mockReturnValue(jest.fn(() => Promise.resolve(encumbrance)));
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render expense class change confirmation modal if there are no affected invoices', async () => {
    renderComponent();

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText(expenseClassOptions[1].label));

    expect(screen.queryByText('ui-orders.poLine.fundDistribution.expenseClass.modal.title')).not.toBeInTheDocument();
  });

  it('should render expense class change confirmation modal if there are affected invoice', async () => {
    fetchInvoiceLines.mockReturnValue(jest.fn(() => Promise.resolve({ invoiceLines: [{}] })));

    renderComponent();

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText(expenseClassOptions[1].label));

    expect(screen.queryByText('ui-orders.poLine.fundDistribution.expenseClass.modal.title')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.confirm' }));

    expect(screen.queryByText('ui-orders.poLine.fundDistribution.expenseClass.modal.title')).not.toBeInTheDocument();
  });
});
