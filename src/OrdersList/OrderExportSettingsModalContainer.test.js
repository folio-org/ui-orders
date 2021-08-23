import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { fetchAllRecords } from '@folio/stripes-acq-components';

import OrderExportSettingsModalContainer from './OrderExportSettingsModalContainer';
import ExportSettingsModalContainer from '../common/ExportSettingsModal/ExportSettingsModalContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchAllRecords: jest.fn().mockResolvedValue([{ id: '0610be6d-0ddd-494b-b867-19f63d8b5d6d' }]),
}));

jest.mock('../common/ExportSettingsModal/ExportSettingsModalContainer', () => jest.fn().mockReturnValue('ExportSettingsModalContainer'));

const defaultProps = {
  ordersQuery: '(workflowStatus==("Closed" or "Open" or "Pending")) sortby metadata.updatedDate/sort.descending',
  onCancel: jest.fn(),
  mutator: {
    exportLines: {
      GET: jest.fn(),
    },
    exportOrders: {
      GET: jest.fn(),
    },
  },
};

const renderOrderExportSettingsModalContainer = (props = {}) => render(
  <OrderExportSettingsModalContainer
    {...defaultProps}
    {...props}
  />,
);

describe('OrderExportSettingsModalContainer', () => {
  it('should render Export Settings Modal Container', () => {
    renderOrderExportSettingsModalContainer();

    expect(screen.getByText('ExportSettingsModalContainer')).toBeInTheDocument();
  });

  it('should call fetchAllRecords function if exporting', async () => {
    renderOrderExportSettingsModalContainer();

    await waitFor(() => ExportSettingsModalContainer.mock.calls[0][0].fetchOrdersAndLines());

    expect(fetchAllRecords).toHaveBeenCalled();
  });

  it('should call onCancel function if canceling', () => {
    renderOrderExportSettingsModalContainer();

    ExportSettingsModalContainer.mock.calls[0][0].onCancel();

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
