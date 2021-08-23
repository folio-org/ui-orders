import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import LayerPO from './LayerPO';
import POForm from '../PurchaseOrder/POForm';

import { location, history } from '../../../test/jest/routerMocks';
import {
  order,
  address,
  user as userMock,

} from '../../../test/jest/fixtures';

jest.mock('../PurchaseOrder/POForm', () => jest.fn().mockReturnValue('POForm'));

const defaultProps = {
  resourses: {
    order: {
      records: [order],
    },
    orderNumber: {
      records: [{ poNumber: '10000' }],
    },
  },
  mutator: {
    order: {
      GET: jest.fn().mockResolvedValue([order]),
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
  it('should render PO form', async () => {
    await waitFor(() => renderLayerPO());

    expect(screen.getByText('POForm')).toBeInTheDocument();
  });

  it('should call onCancel when close icon was clicked', async () => {
    await waitFor(() => renderLayerPO());
    await waitFor(() => POForm.mock.calls[0][0].onCancel());

    expect(history.push).toHaveBeenCalled();
  });

  it('should call onSubmit when form was submitted', async () => {
    await waitFor(() => renderLayerPO());
    await waitFor(() => POForm.mock.calls[0][0].onSubmit({
      orderType: 'ongoing',
    }));

    expect(history.push).toHaveBeenCalled();
  });

  it('should throw an error if the order update was failed ', async () => {
    defaultProps.mutator.order.POST.mockRejectedValue({
      errors: [{ code: '' }],
    });

    await waitFor(() => renderLayerPO());
    await waitFor(() => expect(POForm.mock.calls[0][0].onSubmit({
      orderType: 'ongoing',
    })).rejects.toBeTruthy());
  });
});
