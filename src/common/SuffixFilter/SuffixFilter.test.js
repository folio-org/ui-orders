import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { noop } from 'lodash';
import '@folio/stripes-acq-components/test/jest/__mock__';

import Filter from './SuffixFilter';

const suffixes = [
  {
    'id': 'db9f5d17-0ca3-4d14-ae49-16b63c8fc083',
    'name': 'suff',
    'description': 'Suffix for test purposes',
  },
];

const filterAccordionTitle = 'labelId';

const renderFilter = (records) => (render(
  <IntlProvider locale="en">
    <Filter
      id="filterId"
      activeFilters={[]}
      name="filterName"
      onChange={noop}
      labelId={filterAccordionTitle}
      resources={{ suffixesSetting: { records } }}
    />
  </IntlProvider>,
));

describe('SuffixFilter component', () => {
  afterEach(cleanup);

  it('should display passed title', () => {
    const { getByText } = renderFilter();

    expect(getByText(filterAccordionTitle)).toBeDefined();
  });

  it('should be closed by default', () => {
    const { getByLabelText } = renderFilter();

    expect(getByLabelText(`${filterAccordionTitle} filter list`).getAttribute('aria-expanded') || 'false').toBe('false');
  });

  it('should render all passed options', async () => {
    const { findAllByText } = renderFilter(suffixes);

    const renderedFilterOptions = await findAllByText(/suff/);

    expect(renderedFilterOptions.length).toBe(suffixes.length);
  });
});
