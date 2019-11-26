/* istanbul ignore file */
import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '../../../test/jest/__mock__';

import UserFilter from './UserFilter';

const users = [
  {
    id: 'testUserId',
    personal: {
      firstName: 'Den',
      lastName: 'Bridg',
    },
  },
];
const userFilterLabel = 'ui-orders.orderDetails.assignedTo';

const renderUserFilter = () => (render(
  <IntlProvider locale="en">
    <UserFilter
      id="assignTo"
      activeFilters={[]}
      labelId={userFilterLabel}
      name="assignToFilter"
      onChange={() => {}}
      users={users}
    />
  </IntlProvider>,
));

describe('Given UserFilter component', () => {
  afterEach(cleanup);

  it('Than it should display passed title', () => {
    const { getByText } = renderUserFilter();

    expect(getByText(userFilterLabel)).toBeDefined();
  });
});
