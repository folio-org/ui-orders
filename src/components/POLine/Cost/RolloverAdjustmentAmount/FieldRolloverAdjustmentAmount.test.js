import { MemoryRouter } from 'react-router';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { FieldRolloverAdjustmentAmount } from './FieldRolloverAdjustmentAmount';

const defaultProps = {
  amount: 12.34,
  currency: 'USD',
  name: 'rolloverAdjustmentAmount',
  onClear: jest.fn(),
};

const wrapper = ({ children }) => {
  const Form = stripesFinalForm({})((props) => <form {...props}>{children}</form>);

  return (
    <MemoryRouter>
      <Form
        initialValues={{ rolloverAdjustmentAmount: defaultProps.amount }}
        onSubmit={jest.fn()}
      >
        {children}
      </Form>
    </MemoryRouter>
  );
};

const renderFieldRolloverAdjustmentAmount = (props = {}) => render(
  <FieldRolloverAdjustmentAmount
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('FieldRolloverAdjustmentAmount', () => {
  it('should handle amount clear', async () => {
    renderFieldRolloverAdjustmentAmount();

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /times-circle-solid/i }));
    });

    expect(defaultProps.onClear).toHaveBeenCalled();
  });
});
