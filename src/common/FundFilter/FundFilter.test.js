import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import FundFilter from './FundFilter';

const messages = {
  'stripes-components.selection.filterOptionsPlaceholder': 'Placeholder',
  'stripes-components.selection.filterOptionsLabel': 'Label',
  'stripes-components.selection.emptyList': 'The list is empty',
  'stripes-components.selection.noMatches': 'No any matches',
};

const filterAccordionTitle = 'instance.title';

const renderFundFilter = () => (render(
  <IntlProvider locale="en" messages={messages}>
    <FundFilter
      id="fund"
      activeFilters={[]}
      name="found"
      onChange={() => {}}
      labelId={filterAccordionTitle}
    />
  </IntlProvider>,
));

describe('FundFilter component', () => {
  afterEach(cleanup);

  it('should display passed title', () => {
    const { getByText } = renderFundFilter();

    expect(getByText(filterAccordionTitle)).toBeDefined();
  });
});
