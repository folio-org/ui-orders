import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useLocaleDateFormat } from '@folio/stripes-acq-components';

import { FILTERS } from '../../constants';

export function useSearchableIndexes(customFields) {
  const localeDateFormat = useLocaleDateFormat();
  const intl = useIntl();

  const customFieldsSearchableIndexes = useMemo(() => {
    let result = [];

    if (customFields) {
      result = customFields.map(cf => {
        const customFieldLabel = intl.formatMessage({ id: 'stripes-smart-components.customFields' });
        const fieldLabel = `${customFieldLabel} ${cf.name}`;
        const fieldValue = `${FILTERS.CUSTOM_FIELDS}.${cf.refId}`;

        if (cf.type === 'TEXTBOX_LONG' || cf.type === 'TEXTBOX_SHORT') {
          return {
            label: fieldLabel,
            value: fieldValue,
          };
        } else if (cf.type === 'DATE_PICKER') {
          return {
            label: fieldLabel,
            value: fieldValue,
            placeholder: localeDateFormat,
          };
        } else {
          return null;
        }
      }).filter(obj => obj !== null);
    }

    return result;
  }, [customFields, localeDateFormat, intl]);

  return useMemo(() => [
    {
      labelId: 'ui-orders.search.keyword',
      value: '',
    },
    {
      labelId: 'ui-orders.search.metadata.createdDate',
      value: 'metadata.createdDate',
      placeholder: localeDateFormat,
    },
    {
      labelId: 'ui-orders.search.dateOpened',
      value: 'dateOrdered',
      placeholder: localeDateFormat,
    },
    {
      labelId: 'ui-orders.search.poNumber',
      value: 'poNumber',
    },
    ...customFieldsSearchableIndexes,
  ], [localeDateFormat, customFieldsSearchableIndexes]);
}
