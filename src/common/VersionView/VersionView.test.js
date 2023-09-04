import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useParams, MemoryRouter } from 'react-router-dom';

import VersionView from './VersionView';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

const defaultProps = {
  onVersionClose: jest.fn(),
  isLoading: false,
  children: <span>Version history details</span>,
};

const renderVersionView = (props = {}) => render(
  <VersionView
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('VersionView', () => {
  beforeEach(() => {
    useParams.mockClear().mockReturnValue({});
  });

  it('should render selected version of entity', () => {
    useParams.mockReturnValue({ versionId: 'qwerty-123' });

    renderVersionView();

    expect(screen.getByText('Version history details')).toBeInTheDocument();
  });

  it('should render \'No version to display\' message', () => {
    renderVersionView();

    expect(screen.getByText('ui-orders.versionHistory.noVersion')).toBeInTheDocument();
  });
});
