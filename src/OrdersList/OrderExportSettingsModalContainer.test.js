import React from 'react';
import { act, render, screen } from '@testing-library/react';

import OrderExportSettingsModalContainer from './OrderExportSettingsModalContainer';
import ExportSettingsModalContainer from '../common/ExportSettingsModal/ExportSettingsModalContainer';
import { fetchExportDataByIds } from '../common/utils';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchAllRecords: jest.fn().mockResolvedValue([]),
}));

jest.mock('../common/ExportSettingsModal/ExportSettingsModalContainer', () => jest.fn().mockReturnValue('ExportSettingsModalContainer'));

jest.mock('../common/utils', () => ({
  ...jest.requireActual('../common/utils'),
  fetchExportDataByIds: jest.fn(),
}));

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

    await act(() => ExportSettingsModalContainer.mock.calls[0][0].fetchOrdersAndLines());

    expect(fetchExportDataByIds).toHaveBeenCalled();
  });

  it('should call onCancel function if canceling', () => {
    renderOrderExportSettingsModalContainer();

    ExportSettingsModalContainer.mock.calls[0][0].onCancel();

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
