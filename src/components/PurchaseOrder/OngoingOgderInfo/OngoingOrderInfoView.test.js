import React from 'react';
import { render, screen } from '@testing-library/react';

import OngoingOrderInfoView from './OngoingOrderInfoView';

const renderOngoingOrderInfoView = (props = {}) => render(
  <OngoingOrderInfoView
    {...props}
  />,
);

describe('OngoingOrderInfoView', () => {
  it('should render \'ongoing info\' view with subscription', () => {
    renderOngoingOrderInfoView({
      order: {
        ongoing: {
          isSubscription: true,
        },
      },
    });

    expect(screen.getByText('ui-orders.renewals.subscription')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.renewalInterval')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.renewalDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.reviewPeriod')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.manualRenewal')).toBeInTheDocument();
  });

  it('should render \'ongoing info\' view without subscription', () => {
    renderOngoingOrderInfoView({
      order: {
        ongoing: {
          isSubscription: false,
        },
      },
    });

    expect(screen.getByText('ui-orders.renewals.reviewDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.renewals.notes')).toBeInTheDocument();
  });
});
