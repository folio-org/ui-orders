import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import ExportSettingsModal from './ExportSettingsModal';

const defaultProps = {
  onCancel: jest.fn(),
  isExporting: false,
  onExportCSV: jest.fn(),
};

const renderExportSettingsModal = (props = {}) => render(
  <ExportSettingsModal
    {...defaultProps}
    {...props}
  />,
);

describe('ExportSettingsModal', () => {
  it('should render Export Settings Modal', () => {
    renderExportSettingsModal();

    expect(screen.getByText('ui-orders.exportSettings.label')).toBeDefined();
  });
});

describe('ExportSettingsModal actions', () => {
  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onExportCSV.mockClear();
  });

  describe('selected fields', () => {
    it('should select an option item if it was clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[1]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[0].checked).toBeFalsy();
      expect(radioBtns[1].checked).toBeTruthy();

      const selects = await screen.findAllByRole('textbox');

      await user.click(selects[0]);

      const options = await screen.findAllByRole('option');

      await user.click(options[0]);

      expect(options[0].getAttribute('aria-selected')).toBeTruthy();
    });
  });

  describe('all fields', () => {
    it('should select all PO fields when the corresponding radio button was clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[1]);
      await user.click(screen.getAllByRole('radio')[0]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[0].checked).toBeTruthy();
    });

    it('should select all POL fields when the corresponding radio button was clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[3]);
      await user.click(screen.getAllByRole('radio')[2]);

      const radioBtns = await screen.findAllByRole('radio');

      expect(radioBtns[2].checked).toBeTruthy();
    });
  });

  describe('export', () => {
    it('should export all PO and POL fields to CSV when export button clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getByText('ui-orders.exportSettings.export'));

      expect(defaultProps.onExportCSV).toHaveBeenCalled();
    });

    it('should export selected PO fields to CSV when export button clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[1]);

      const selects = await screen.findAllByRole('textbox');

      await user.click(selects[0]);

      const options = await screen.findAllByRole('option');

      await user.click(options[0]);
      await user.click(screen.getByText('ui-orders.exportSettings.export'));

      expect(defaultProps.onExportCSV).toHaveBeenCalled();
    });

    it('should export selected POL fields to CSV when export button clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getAllByRole('radio')[3]);

      const selects = await screen.findAllByRole('textbox');

      await user.click(selects[1]);

      const options = await screen.findAllByRole('option');

      await user.click(options[0]);
      await user.click(screen.getByText('ui-orders.exportSettings.export'));

      expect(defaultProps.onExportCSV).toHaveBeenCalled();
    });

    it('should prevent export if it is already exporting now', async () => {
      renderExportSettingsModal({ isExporting: true });

      await user.click(screen.getByText('ui-orders.exportSettings.export'));

      expect(defaultProps.onExportCSV).not.toHaveBeenCalled();
    });

    it('should close Export Settings Modal when cancel button clicked', async () => {
      renderExportSettingsModal();

      await user.click(screen.getByText('ui-orders.exportSettings.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
