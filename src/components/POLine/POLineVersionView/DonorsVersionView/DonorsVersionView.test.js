import { QueryClient, QueryClientProvider } from 'react-query';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { VersionViewContextProvider } from '@folio/stripes-acq-components';

import { DonorsVersionView } from './DonorsVersionView';

const queryClient = new QueryClient();

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  DonorsListContainer: jest.fn().mockReturnValue('DonorsListContainer'),
}));

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const versions = [
  {
    id: '1',
    snapshot: {
      donorOrganizationIds: ['1'],
    },
  },
];

const defaultProps = {
  version: versions[0].snapshot,
};

const contextValues = {
  snapshotPath: 'snapshot',
  versionId: versions[0].id,
  versions,
};

const renderDonorsVersionView = (props = defaultProps) => render(
  <VersionViewContextProvider {...contextValues}>
    <DonorsVersionView {...props} />
  </VersionViewContextProvider>,
  { wrapper },
);

describe('DonorsVersionView', () => {
  it('should render component', () => {
    renderDonorsVersionView();

    expect(screen.getByText('DonorsListContainer')).toBeInTheDocument();
  });
});
