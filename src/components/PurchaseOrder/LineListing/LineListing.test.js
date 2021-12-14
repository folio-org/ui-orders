import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import LineListing from './LineListing';
import { orderLine } from '../../../../test/jest/fixtures';

const defaultProps = {
  poLines: [orderLine],
  funds: [{
    id: 'id',
    code: 'code',
  }],
  baseUrl: '',
  visibleColumns: ['poLineNumber', 'title', 'productId', 'vendorRefNumber', 'fundCode', 'arrow'],
};

const renderLineListing = (props = {}) => render(
  <LineListing
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('LineListing', () => {
  it('should render lines multicolumn list', () => {
    renderLineListing();

    expect(screen.getByText('ui-orders.poLine.number')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.lineListing.titleOrPackage')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.lineListing.productId')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.lineListing.refNumber')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.lineListing.fundCode')).toBeInTheDocument();
  });
});
