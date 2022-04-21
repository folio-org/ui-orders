import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import {
  PAYMENT_STATUS,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';

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

  it('should render cancel icon', () => {
    renderLineListing({
      ...defaultProps,
      poLines: [{
        ...orderLine,
        paymentStatus: PAYMENT_STATUS.cancelled,
        receiptStatus: RECEIPT_STATUS.cancelled,
      }],
    });

    expect(screen.getByTestId('cancel-icon')).toBeInTheDocument();
  });

  it('should render only POL number without cancel icon', () => {
    renderLineListing();

    expect(screen.getByText(orderLine.poLineNumber)).toBeInTheDocument();
    expect(screen.queryByTestId('cancel-icon')).toBeNull();
  });
});
