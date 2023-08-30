import { render, screen } from '@folio/jest-config-stripes/testing-library/react';

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
