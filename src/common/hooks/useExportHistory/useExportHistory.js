import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { EXPORT_HISTORY_API } from '../../../components/Utils/api';

export const useExportHistory = (poLineIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'export-history' });

  const searchParams = {
    limit: LIMIT_MAX,
    // TODO: add query based on po-lines ids
    // query: ''
  };

  const {
    data = {},
    isLoading,
  } = useQuery(
    [namespace, poLineIds],
    () => ky.get(EXPORT_HISTORY_API, { searchParams }).json(),
    {
      enabled: Boolean(poLineIds.length),
    },
  );

  return ({
    isLoading,
    exportHistory: data?.exportHistories || [],
    totalRecords: data?.totalRecords,
  });
};
