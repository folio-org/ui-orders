import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import OngoingOrderInfoView from './OngoingOrderInfoView';
import { ORDER_TYPE } from '../../../common/constants';

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

  it.each`
  checked
  ${true}
  ${false}
  `('should render \'ongoing info\' view with subscription $checked', ({ checked }) => {
    renderOngoingOrderInfoView({
      order: {
        ongoing: {
          isSubscription: checked,
        },
        orderType: ORDER_TYPE.ongoing,
        workflowStatus: ORDER_STATUSES.open,
      },
    });
    expect(screen.getByRole('checkbox', { name: 'ui-orders.renewals.subscription', checked })).toBeInTheDocument();
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
