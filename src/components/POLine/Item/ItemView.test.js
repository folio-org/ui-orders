import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

import ItemView from './ItemView';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderItemView = (props = {}) => render(
  <ItemView
    {...props}
  />,
  { wrapper },
);

describe('ItemView', () => {
  it('should render \'item\' view', () => {
    renderItemView();

    expect(screen.getByText('ui-orders.itemDetails.title')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.receivingNote')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.subscriptionFrom')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.subscriptionTo')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.subscriptionInterval')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.publicationDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.publisher')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.edition')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.linkPackage')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.contributors')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.productIds')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.itemDetails.internalNote')).toBeInTheDocument();
  });
});
