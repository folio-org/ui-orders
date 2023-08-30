import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import PhysicalView from './PhysicalView';

const defaultProps = {
  materialTypes: [{
    label: 'label',
    value: 'value',
  }],
};

const renderPhysicalView = (props = {}) => render(
  <PhysicalView
    {...defaultProps}
    {...props}
  />,
);

describe('PhysicalView', () => {
  it('should render \'physical\' view', () => {
    renderPhysicalView();

    expect(screen.getByText('ui-orders.physical.materialSupplier')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.receiptDue')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.expectedReceiptDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.physical.createInventory')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.materialType')).toBeInTheDocument();
  });
});
