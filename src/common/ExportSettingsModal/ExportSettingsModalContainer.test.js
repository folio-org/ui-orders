import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { exportToCsv } from '@folio/stripes/components';

import ExportSettingsModalContainer from './ExportSettingsModalContainer';

jest.mock('@folio/stripes/smart-components', () => {
  return {
    ...jest.requireActual('@folio/stripes/smart-components'),
    useCustomFields: () => [],
  };
});

jest.mock('@folio/stripes/components', () => {
  return {
    ...jest.requireActual('@folio/stripes/components'),
    exportToCsv: jest.fn(),
  };
});

jest.mock('./utils', () => {
  return {
    ...jest.requireActual('./utils'),
    getExportData: jest.fn().mockResolvedValue([{ field1: 'value1', field2: 'value2' }]),
    getExportLineFields: () => ({ field1: 'field1 name' }),
    getExportOrderFields: () => ({ field2: 'field2 name' }),
  };
});

const mockMutator = {
  exportVendors: {
    GET: jest.fn(),
  },
  exportUsers: {
    GET: jest.fn(),
  },
  exportAddresses: {
    GET: jest.fn(),
  },
  exportAcqUnits: {
    GET: jest.fn(),
  },
  exportContributorNameTypes: {
    GET: jest.fn(),
  },
  exportExpenseClasses: {
    GET: jest.fn(),
  },
  exportIdentifierTypes: {
    GET: jest.fn(),
  },
  exportLocations: {
    GET: jest.fn(),
  },
  exportMaterialTypes: {
    GET: jest.fn(),
  },
};

const defaultProps = {
  fetchOrdersAndLines: jest.fn().mockResolvedValue({}),
  onCancel: jest.fn(),
  mutator: mockMutator,
};

const renderExportSettingsModalContainer = () => render(<ExportSettingsModalContainer {...defaultProps} />);

describe('ExportSettingsModalContainer:', () => {
  it('should render Export Settings Modal', () => {
    renderExportSettingsModalContainer();

    expect(screen.getByText('ui-orders.exportSettings.label')).toBeInTheDocument();
  });

  describe('when export button in Export Settings Modal is clicked:', () => {
    beforeEach(async () => {
      renderExportSettingsModalContainer();
      await user.click(screen.getByText('ui-orders.exportSettings.export'));
    });

    it('should fetch orders and lines', async () => {
      expect(defaultProps.fetchOrdersAndLines).toHaveBeenCalled();
    });

    it('should call exportToCsv with correct parameters', () => {
      expect(exportToCsv).toHaveBeenCalledWith(
        [
          { field1: 'field1 name', field2: 'field2 name' },
          { field1: 'value1', field2: 'value2' },
        ],
        expect.any(Object),
      );
    });
  });

  describe('when cancel button in Export Settings Modal is clicked:', () => {
    it('should call onCancel function', async () => {
      renderExportSettingsModalContainer();
      await user.click(screen.getByText('ui-orders.exportSettings.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
