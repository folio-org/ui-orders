import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { exportHistory } from 'fixtures';
import { ExportDetailsList } from './ExportDetailsList';

const defaultProps = {
  data: [exportHistory],
  isLoading: false,
};

const renderExportDetailsList = (props = {}) => render(
  <ExportDetailsList
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('ExportDetailsList', () => {
  it('should render loader when data is loading', () => {
    const { container } = renderExportDetailsList({ isLoading: true });

    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('should render export details list', () => {
    renderExportDetailsList();

    expect(screen.getByText('ui-orders.export.jobId')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.export.exportDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.export.fileName')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.export.method')).toBeInTheDocument();
  });
});
