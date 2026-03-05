import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router';

import {
  act,
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { useOkapiKy } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import { PO_FORM_FIELDS } from '../../../common/constants';
import { ORDER_NUMBER_VALIDATE_API } from '../../Utils/api';
import { usePONumberFieldValidator } from '../hooks';
import { FieldPONumber } from './FieldPONumber';

const defaultProps = {
  onBlur: jest.fn(),
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => {
  const Form = stripesFinalForm({})((props) => <form {...props}>{children}</form>);

  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Form
          initialValues={{ [PO_FORM_FIELDS.poNumber]: 1000 }}
          onSubmit={jest.fn()}
        >
          {children}
        </Form>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

const TestComponent = (props = {}) => {
  const { validate } = usePONumberFieldValidator();

  return (
    <FieldPONumber
      validate={validate}
      {...defaultProps}
      {...props}
    />
  );
};

const renderComponent = (props = {}) => render(
  <TestComponent {...props} />,
  { wrapper },
);

const postMock = jest.fn().mockResolvedValue();

const getPONumberField = () => screen.getByLabelText('ui-orders.orderDetails.poNumber');

const buildErrorResponse = (code) => {
  const response = {
    clone: () => response,
    json: () => ({ errors: [{ code }] }),
  };

  return response;
};

describe('FieldPONumber', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({ post: postMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render PO Number field with initial value', () => {
    renderComponent();

    expect(getPONumberField()).toHaveValue('1000');
  });

  describe('Validation', () => {
    it('should call validate function when PO Number was changed', async () => {
      const NEW_VALUE = '42000';

      renderComponent();

      await act(async () => {
        const field = getPONumberField();

        await userEvent.clear(field);
        await userEvent.type(field, NEW_VALUE);
      });

      expect(getPONumberField()).toHaveValue(NEW_VALUE);
      expect(postMock).toHaveBeenLastCalledWith(
        ORDER_NUMBER_VALIDATE_API,
        expect.objectContaining({
          json: { [PO_FORM_FIELDS.poNumber]: NEW_VALUE },
        }),
      );
    });

    it('should render validation error when PO Number is already in use', async () => {
      postMock.mockRejectedValue({ response: buildErrorResponse('poNumberNotUnique') });

      renderComponent();

      await act(async () => {
        const field = getPONumberField();

        await userEvent.type(field, '42');
        field.blur();
      });

      expect(screen.getByText('ui-orders.errors.poNumberNotUnique')).toBeInTheDocument();
    });

    it('should render validation error when PO Number is mismatch the pattern', async () => {
      postMock.mockRejectedValue({ response: buildErrorResponse('jakarta.validation.constraints.Pattern.message') });

      renderComponent();

      await act(async () => {
        const field = getPONumberField();

        await userEvent.type(field, '42');
        field.blur();
      });

      expect(screen.getByText('ui-orders.errors.poNumberPatternMismatch')).toBeInTheDocument();
    });

    it('should render default validation error for unknown error code', async () => {
      postMock.mockRejectedValue({ response: buildErrorResponse('qwerty') });

      renderComponent();

      await act(async () => {
        const field = getPONumberField();

        await userEvent.type(field, '42');
        field.blur();
      });

      expect(screen.getByText('ui-orders.errors.orderNumberIsNotValid')).toBeInTheDocument();
    });
  });
});
