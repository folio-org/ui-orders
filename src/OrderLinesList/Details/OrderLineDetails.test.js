import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Tags } from '@folio/stripes-acq-components';

import OrderLineDetails from './OrderLineDetails';
import { POLineView } from '../../components/POLine';

import { orderLine, order } from '../../../test/jest/fixtures';
import { match, history, location } from '../../../test/jest/routerMocks';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  Tags: jest.fn().mockReturnValue('Tags'),
}));
jest.mock('../../components/POLine/POLineView', () => jest.fn().mockReturnValue('POLineView'));

const mutator = {
  orderLine: {
    GET: jest.fn().mockResolvedValue(orderLine),
    PUT: jest.fn(),
    DELETE: jest.fn().mockResolvedValue(),
  },
  order: {
    GET: jest.fn().mockResolvedValue(order),
  },
  locations: {
    GET: jest.fn(),
  },
  materialTypes: {
    GET: jest.fn(),
  },
  funds: {
    GET: jest.fn(),
  },
};

const defaultProps = {
  refreshList: jest.fn(),
  resources: {},
  match: {
    ...match,
    params: {
      id: orderLine.id,
    },
  },
  location,
  history,
  mutator,
};

const renderOrderLineDetails = (props = {}) => render(
  <OrderLineDetails
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrderLineDetails', () => {
  it('should render POLineView', async () => {
    renderOrderLineDetails();

    const component = await screen.findByText(/POLineView/i);

    expect(component).toBeInTheDocument();
  });
});

describe('OrderLineDetails actions', () => {
  beforeEach(() => {
    POLineView.mockClear();
  });

  it('should navigate to order details view', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].goToOrderDetails());

    expect(history.push).toHaveBeenCalledWith({
      pathname: `/orders/view/${order.id}`,
      search: `qindex=poNumber&query=${order.poNumber}`,
    });
  });

  it('should delete order line', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].deleteLine());

    expect(mutator.orderLine.DELETE).toHaveBeenCalled();
  });

  it('should call \'delete\' function even if it is rejected', async () => {
    mutator.orderLine.DELETE.mockRejectedValue();

    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].deleteLine());

    expect(mutator.orderLine.DELETE).toHaveBeenCalled();
  });

  it('should toggle Tags pane', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].tagsToggle());

    expect(screen.getByText(/Tags/i)).toBeInTheDocument();
  });

  it('should close corresponding pane', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].onClose());

    expect(history.push).toHaveBeenCalledWith({
      pathname: '/orders/lines',
      search: location.search,
    });
  });

  it('should update line tag list', async () => {
    renderOrderLineDetails();

    await waitFor(() => POLineView.mock.calls[0][0].tagsToggle());
    await waitFor(() => Tags.mock.calls[0][0].putMutator());

    expect(mutator.orderLine.PUT).toHaveBeenCalled();
  });
});
