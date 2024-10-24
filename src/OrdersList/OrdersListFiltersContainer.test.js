import { render } from '@folio/jest-config-stripes/testing-library/react';

import OrdersListFiltersContainer from './OrdersListFiltersContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useFunds: jest.fn(() => ({ funds: [{ id: 'id', code: 'code' }] })),
}));
jest.mock('./OrdersListFilters', () => jest.fn().mockReturnValue('OrdersListFilters'));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
  resources: {},
};

const renderOrdersListFiltersContainer = (props = {}) => render(
  <OrdersListFiltersContainer
    {...defaultProps}
    {...props}
  />,
);

describe('OrdersListFiltersContainer', () => {
  it('should display order list filters', () => {
    const { getByText } = renderOrdersListFiltersContainer();

    expect(getByText('OrdersListFilters')).toBeDefined();
  });
});
