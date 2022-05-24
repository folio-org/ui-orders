import React from 'react';
import { render, screen } from '@testing-library/react';

import OngoingOrderView from './OngoingOrderView';

const renderOngoingOrderView = (props = {}) => render(
  <OngoingOrderView {...props} />,
);

describe('OngoingOrderView', () => {
  it('should render \'OngoingOrderView\'', () => {
    renderOngoingOrderView();

    expect(screen.getByText('ui-orders.poLine.renewalNote')).toBeInTheDocument();
  });
});
