import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';
import prefixKeys from '@folio/stripes-acq-components/test/bigtest/helpers/prefixKeys';
import translations from '../../../translations/ui-orders/en';

import FundFilter from './FundFilter';

const filterAccordionTitle = 'instance.title';

const renderFundFilter = () => (render(
  <IntlProvider locale="en" key="en" timeZone="UTC" messages={prefixKeys(translations)}>
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
