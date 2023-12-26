import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { VersionViewContextProvider } from '@folio/stripes-acq-components';
import { useOkapiKy } from '@folio/stripes/core';

import { DonorsVersionView } from './DonorsVersionView';

const queryClient = new QueryClient();

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useNamespace: jest.fn(() => ['NameSpace']),
  useStripes: jest.fn(() => ({
    hasPerm: jest.fn().mockReturnValue(true),
  })),
}));

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
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

const donor = { id: 'id', name: 'Amazon', code: 'AMZ' };
const getMock = jest.fn().mockReturnValue({
  json: () => Promise.resolve(({ organizations: [donor], totalRecords: 1 })),
});

describe('DonorsVersionView', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: getMock,
      });
  });
  it('should render component', async () => {
    renderDonorsVersionView();

    await waitFor(() => screen.getByText(donor.name));
    await waitFor(() => screen.getByText(donor.code));
  });
});
