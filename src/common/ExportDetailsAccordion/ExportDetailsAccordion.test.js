import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import { exportHistory } from 'fixtures';
import ExportDetailsAccordion from './ExportDetailsAccordion';

jest.mock('../ExportDetailsList', () => ({
  ExportDetailsList: jest.fn(() => 'ExportDetailsList'),
}));

const defaultProps = {
  exportHistory: [exportHistory],
  id: 'exportDetails',
  isLoading: false,
};

const renderExportDetailsAccordion = (props = {}) => render(
  <ExportDetailsAccordion
    {...defaultProps}
    {...props}
  />,
);

describe('ExportDetailsAccordion', () => {
  it('should render export details list', () => {
    renderExportDetailsAccordion();

    expect(screen.getByText('ExportDetailsList')).toBeInTheDocument();
  });
});
