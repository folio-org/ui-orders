import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderLinesFilters from '@folio/plugin-find-po-line/FindPOLine/OrderLinesFilters';

import OrderLinesFiltersContainer from './OrderLinesFiltersContainer';

jest.mock('@folio/plugin-find-po-line/FindPOLine/OrderLinesFilters', () => jest.fn().mockReturnValue('OrderLinesFilters'));

const defaultProps = {
  activeFilters: {},
  applyFilters: jest.fn(),
  disabled: false,
  resources: {},
};

const renderOrderLinesFiltersContainer = (props = {}) => render(
  <OrderLinesFiltersContainer
    {...defaultProps}
    {...props}
  />,
);

describe('OrderLinesFiltersContainer', () => {
  it('should display order list filters', () => {
    renderOrderLinesFiltersContainer();

    expect(screen.getByText('OrderLinesFilters')).toBeDefined();
  });

  it('should call \'applyFilters\' function when filtes changed', () => {
    renderOrderLinesFiltersContainer();

    OrderLinesFilters.mock.calls[0][0].onChange({ name: 'name', values: [] });

    expect(defaultProps.applyFilters).toHaveBeenCalled();
  });
});
