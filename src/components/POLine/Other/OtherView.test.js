import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import OtherView from './OtherView';

const defaultProps = {
  materialTypes: [{
    label: 'label',
    value: 'value',
  }],
};

const renderOtherView = (props = {}) => render(
  <OtherView
    {...defaultProps}
    {...props}
  />,
);

describe('OtherView', () => {
  it('should render \'other\' view', () => {
    renderOtherView();

    expect(screen.getByText('ui-orders.physical.materialSupplier')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.receiptDue')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.expectedReceiptDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.createInventory')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
  });
});
