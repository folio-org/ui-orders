import React from 'react';
import user from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';

import ExportSettingsModalContainer from './ExportSettingsModalContainer';

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
  fetchOrdersAndLines: jest.fn(),
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
    it('should fetch orders and lines', () => {
      renderExportSettingsModalContainer();
      user.click(screen.getByText('ui-orders.exportSettings.export'));

      expect(defaultProps.fetchOrdersAndLines).toHaveBeenCalled();
    });
  });

  describe('when cancel button in Export Settings Modal is clicked:', () => {
    it('should call onCancel function', () => {
      renderExportSettingsModalContainer();
      user.click(screen.getByText('ui-orders.exportSettings.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
