import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import '@folio/stripes-acq-components/test/jest/__mock__';

import FundFilter from './FundFilter';

const messages = {
  'stripes-components.selection.filterOptionsPlaceholder': 'Placeholder',
  'stripes-components.selection.filterOptionsLabel': 'Label',
  'stripes-components.selection.emptyList': 'The list is empty',
  'stripes-components.selection.noMatches': 'No any matches',
};

const filterAccordionTitle = 'ui-orders.filter.fundCode';

const renderFundFilter = (funds) => (render(
  <IntlProvider locale="en" messages={messages}>
    <FundFilter
      id="fund"
      activeFilters={[]}
      name="fund"
      onChange={noop}
      labelId={filterAccordionTitle}
      funds={funds}
    />
  </IntlProvider>,
));

describe('FundFilter component', () => {
  afterEach(cleanup);

  it('should display passed title', () => {
    const { getByText } = renderFundFilter();

    expect(getByText(filterAccordionTitle)).toBeDefined();
  });

  it('should be closed by default', () => {
    const { getByRole } = renderFundFilter();

    expect(getByRole('tab').getAttribute('aria-expanded') || 'false').toBe('false');
  });
});
