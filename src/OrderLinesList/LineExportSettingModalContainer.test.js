import { waitFor, render, screen } from '@folio/jest-config-stripes/testing-library/react';

import ExportSettingsModalContainer from '../common/ExportSettingsModal/ExportSettingsModalContainer';
import { fetchExportDataByIds } from '../common/utils';
import LineExportSettingModalContainer from './LineExportSettingModalContainer';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  fetchAllRecords: jest.fn().mockResolvedValue([{ purchaseOrderId: '0610be6d-0ddd-494b-b867-19f63d8b5d6d' }]),
}));

jest.mock('../common/ExportSettingsModal/ExportSettingsModalContainer', () => jest.fn().mockReturnValue('ExportSettingsModalContainer'));

jest.mock('../common/utils', () => ({
  ...jest.requireActual('../common/utils'),
  fetchExportDataByIds: jest.fn(),
}));

const defaultProps = {
  linesQuery: '',
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

const renderLineExportSettingModalContainer = (props = {}) => render(
  <LineExportSettingModalContainer
    {...defaultProps}
    {...props}
  />,
);

describe('LineExportSettingModalContainer', () => {
  it('should render Export Settings Modal Container', () => {
    renderLineExportSettingModalContainer();

    expect(screen.getByText('ExportSettingsModalContainer')).toBeInTheDocument();
  });

  it('should call fetchAllRecords function if exporting', async () => {
    renderLineExportSettingModalContainer();

    await waitFor(() => ExportSettingsModalContainer.mock.calls[0][0].fetchOrdersAndLines());

    expect(fetchExportDataByIds).toHaveBeenCalled();
  });

  it('should call onCancel function if canceling', () => {
    renderLineExportSettingModalContainer();

    ExportSettingsModalContainer.mock.calls[0][0].onCancel();

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
