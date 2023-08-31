import { MemoryRouter } from 'react-router-dom';

import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useShowCallout } from '@folio/stripes-acq-components';

import { exportHistory, orderLine } from 'fixtures';
import { REEXPORT_SOURCES } from '../constants';
import { useReexport } from '../hooks';
import { ReexportModal } from './ReexportModal';

const vendorName = 'Test Vendor';
const showCallout = jest.fn();

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useOrganization: jest.fn(() => ({ name: vendorName, isLoading: false })),
  useShowCallout: jest.fn(() => jest.fn()),
}));
jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useReexport: jest.fn(() => ({
    reExport: jest.fn(),
    isLoading: false,
  })),
}));

const defaultProps = {
  exportHistory: [exportHistory],
  id: 'reexport-modal',
  isLoading: false,
  onCancel: jest.fn(),
  onConfirm: jest.fn(),
  order: { id: 'id' },
  poLines: [orderLine],
  source: REEXPORT_SOURCES.order,
};

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderReexportModal = (props = {}) => render(
  <ReexportModal
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('ReexportModal', () => {
  it('should render \'Re-export\' modal', () => {
    renderReexportModal();

    expect(screen.getByText(`ui-orders.reexport.${defaultProps.source}.confirmModal.message`)).toBeInTheDocument();
  });
});

describe('ReexportModal actions', () => {
  const mockReexport = {
    reExport: jest.fn(() => Promise.resolve()),
    isLoading: false,
  };

  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onConfirm.mockClear();
    mockReexport.reExport.mockClear();
    useReexport.mockClear().mockReturnValue(mockReexport);
    useShowCallout.mockClear().mockReturnValue(showCallout);
  });

  it('should call \'onConfirm\' when \'Confirm\' button was clicked', async () => {
    renderReexportModal();

    await user.click(screen.getByText('ui-orders.button.confirm'));

    expect(mockReexport.reExport).toHaveBeenCalled();
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('should catch reexport error', async () => {
    mockReexport.reExport.mockImplementation(() => Promise.reject(new Error('Test')));

    renderReexportModal();

    await user.click(screen.getByText('ui-orders.button.confirm'));

    expect(defaultProps.onConfirm).toHaveBeenCalled();
    expect(showCallout).toHaveBeenCalled();
  });

  it('should call \'onCancel\' when \'Cancel\' button was clicked', async () => {
    renderReexportModal();

    await user.click(screen.getByText('ui-orders.buttons.line.cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
});
