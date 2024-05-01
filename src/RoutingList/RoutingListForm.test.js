import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import RoutingListForm from './RoutingListForm';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  LoadingView: jest.fn(() => 'Loading'),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [{ id: '1', personal: { firstName: 'firstName', lastName: 'lastName' } }],
    isLoading: false,
  }),
}));

const wrapper = ({ children }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

const renderComponent = () => (render(
  <RoutingListForm onSubmit={jest.fn()} />,
  { wrapper },
));

describe('RoutingListForm', () => {
  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-orders.routing.list.generalInformation')).toBeDefined();
  });
});
