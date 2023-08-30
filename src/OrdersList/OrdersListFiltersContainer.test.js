import { render } from '@folio/jest-config-stripes/testing-library/react';

import OrdersListFiltersContainer from './OrdersListFiltersContainer';

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
