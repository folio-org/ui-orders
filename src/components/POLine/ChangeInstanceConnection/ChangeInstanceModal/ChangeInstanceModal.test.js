import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import ChangeInstanceModal from './ChangeInstanceModal';

jest.mock('../RelatedItemsList', () => ({ RelatedItemsList: jest.fn(() => 'RelatedItemsList') }));

const defaultProps = {
  detailed: false,
  isLoading: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  poLine: {
    instanceId: 'instanceId',
    titleOrPackage: 'Old instance title',
  },
  selectedInstance: {
    id: 'newInstanceId',
    title: 'New instance title',
  },
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <MemoryRouter>
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  </MemoryRouter>
);

const renderChangeInstanceModal = (props = {}) => render(
  <ChangeInstanceModal
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('ChangeInstanceModal', () => {
  it('should render default confirmation modal', () => {
    renderChangeInstanceModal();

    expect(screen.getByText('ui-orders.line.changeInstance.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.line.changeInstance.message')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.line.changeInstance.confirmLabel')).toBeInTheDocument();
  });

  it('should render detailed confirmation modal', () => {
    renderChangeInstanceModal({ detailed: true });

    expect(screen.getByText('ui-orders.line.changeInstance.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.line.changeInstance.detailedMessage')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.buttons.line.submit')).toBeInTheDocument();
  });
});
