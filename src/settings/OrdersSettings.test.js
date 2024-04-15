import { MemoryRouter } from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { useCentralOrderingSettings } from '@folio/stripes-acq-components';

import OrdersSettings from './OrdersSettings';

jest.mock('@folio/stripes-components', () => ({
  ...jest.requireActual('@folio/stripes-components'),
  LoadingPane: () => 'LoadingPane',
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useCentralOrderingSettings: jest.fn(),
}));
jest.mock('./sections', () => ({
  NETWORK_ORDERING_SECTION: { label: 'network-ordering-label', pages: [] },
  SECTIONS: [{ label: 'init-sections-label', pages: [] }],
}));

const renderOrdersSettings = (props = {}) => render(
  <OrdersSettings {...props} />,
  { wrapper: MemoryRouter },
);

describe('OrdersSettings', () => {
  beforeEach(() => {
    useCentralOrderingSettings
      .mockClear()
      .mockReturnValue(() => ({ isLoading: false }));
  });

  it('should render loader if central ordering settings still loading', async () => {
    useCentralOrderingSettings.mockReturnValue({ isLoading: true });

    renderOrdersSettings();

    expect(screen.getByText('LoadingPane')).toBeInTheDocument();
  });

  it('should render settings if central ordering settings loaded and enabled', async () => {
    useCentralOrderingSettings
      .mockImplementationOnce(({ onSuccess }) => {
        onSuccess({ value: 'true' });

        return {
          isLoading: false,
        };
      })
      .mockImplementation(() => ({ isLoading: false }));

    renderOrdersSettings();

    expect(screen.getByText('ui-orders.settings.index.paneTitle')).toBeInTheDocument();
    expect(screen.getByText('init-sections-label')).toBeInTheDocument();
    expect(screen.getByText('network-ordering-label')).toBeInTheDocument();
  });

  it('should render settings if central ordering settings loaded and disabled', async () => {
    useCentralOrderingSettings
      .mockImplementationOnce(({ onSuccess }) => {
        onSuccess({ value: 'false' });

        return {
          isLoading: false,
        };
      })
      .mockImplementation(() => ({ isLoading: false }));

    renderOrdersSettings();

    expect(screen.getByText('ui-orders.settings.index.paneTitle')).toBeInTheDocument();
    expect(screen.getByText('init-sections-label')).toBeInTheDocument();
    expect(screen.queryByText('network-ordering-label')).not.toBeInTheDocument();
  });
});
