import { MemoryRouter } from 'react-router';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { ORDER_TYPES } from '@folio/stripes-acq-components';

import {
  address,
  order,
  user as userMock,
} from 'fixtures';
import {
  history,
  location,
} from 'fixtures/routerMocks';
import { useOrder } from '../../common/hooks';
import POForm from '../PurchaseOrder/POForm';
import LayerPO from './LayerPO';

jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useOrder: jest.fn(),
}));
jest.mock('../PurchaseOrder/POForm', () => jest.fn().mockReturnValue('POForm'));

const defaultProps = {
  resourses: {
    orderNumber: {
      records: [{ poNumber: '10000' }],
    },
  },
  mutator: {
    order: {
      POST: jest.fn().mockResolvedValue([order]),
      PUT: jest.fn().mockResolvedValue([order]),
    },
    addresses: {
      GET: jest.fn().mockResolvedValue([address]),
    },
    users: {
      GET: jest.fn().mockResolvedValue([userMock]),
    },
    orderNumber: {
      GET: jest.fn().mockResolvedValue([]),
      reset: jest.fn(),
    },
    orderNumberSetting: {
      GET: jest.fn().mockResolvedValue([]),
    },
    prefixesSetting: {
      GET: jest.fn().mockResolvedValue([]),
    },
    suffixesSetting: {
      GET: jest.fn().mockResolvedValue([]),
    },
    orderTemplates: {
      GET: jest.fn().mockResolvedValue([]),
    },
    expenseClass: {
      GET: jest.fn().mockResolvedValue([]),
    },
  },
  match: { params: { id: '' } },
  location,
  history,
};

const renderLayerPO = (props = {}) => render(
  <LayerPO
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('LayerPO', () => {
  beforeEach(() => {
    useOrder.mockReturnValue({ order });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render PO form', async () => {
    renderLayerPO();

    const form = await screen.findByText('POForm');

    expect(form).toBeInTheDocument();
  });

  it('should call onCancel when close icon was clicked', async () => {
    renderLayerPO();

    await waitFor(() => POForm.mock.calls[0][0].onCancel());

    expect(history.push).toHaveBeenCalled();
  });

  it('should call onSubmit when form was submitted', async () => {
    renderLayerPO();

    await waitFor(() => POForm.mock.calls[0][0].onSubmit({
      orderType: ORDER_TYPES.ongoing,
    }));

    expect(history.push).toHaveBeenCalled();
  });

  describe('Create from inventory', () => {
    it('should call onSubmit when form was submitted 2', async () => {
      const locationState = {
        instanceId: 'instanceId',
        instanceTenantId: 'instanceTenantId',
      };

      renderLayerPO({
        location: {
          ...defaultProps.location,
          state: locationState,
        },
      });

      await waitFor(() => POForm.mock.calls[0][0].onSubmit({
        orderType: ORDER_TYPES.ongoing,
      }));

      expect(history.push).toHaveBeenCalledWith(expect.objectContaining({
        pathname: expect.stringMatching(/^\/orders\/view\/(?<orderId>.+)\/po-line\/create$/),
        state: locationState,
      }));
    });
  });

  it('should throw an error if the order update was failed ', async () => {
    defaultProps.mutator.order.POST.mockRejectedValue({});

    renderLayerPO();

    await waitFor(() => expect(POForm.mock.calls[0][0].onSubmit({
      orderType: ORDER_TYPES.ongoing,
    })).rejects.toBeTruthy());
  });
});
