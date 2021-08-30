import React from 'react';
import { render, screen } from '@testing-library/react';

import ItemView from './ItemView';

const renderItemView = (props = {}) => render(
  <ItemView
    {...props}
  />,
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
