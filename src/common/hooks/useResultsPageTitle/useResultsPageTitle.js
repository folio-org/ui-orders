import { useIntl } from 'react-intl';

import { SEARCH_PARAMETER } from '@folio/stripes-acq-components';

export const useResultsPageTitle = (filters) => {
  const intl = useIntl();
  const query = filters?.[SEARCH_PARAMETER];

  return query
    ? intl.formatMessage({ id: 'ui-orders.document.title.orders.search' }, { query })
    : null;
};
