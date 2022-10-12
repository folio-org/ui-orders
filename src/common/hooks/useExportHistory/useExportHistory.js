import { useQuery } from 'react-query';
import { uniqBy } from 'lodash/fp';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';
import { batchRequest } from '@folio/stripes-acq-components';

import { EXPORT_HISTORY_API } from '../../../components/Utils/api';

const buildQueryByPoLineIds = (poLineIds) => {
  const query = poLineIds.map(id => `"*\\"${id}\\"*"`).join(' or ');

  return `exportedPoLineIds==(${query}) sortby exportDate/sort.descending`;
};

export const useExportHistory = (poLineIds = []) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'export-history' });

  const fetchFn = ({ params: searchParams }) => (
    ky.get(EXPORT_HISTORY_API, { searchParams })
      .json()
      .then(({ exportHistories }) => exportHistories)
  );

  const {
    data = {},
    isLoading,
  } = useQuery(
    [namespace, poLineIds],
    async () => {
      const exportHistories = await batchRequest(
        fetchFn,
        poLineIds,
        buildQueryByPoLineIds,
      )
        .then(uniqBy('id'))
        .then(histories => histories.sort((a, b) => new Date(b.exportDate) - new Date(a.exportDate)));

      return {
        exportHistories,
        totalRecords: exportHistories.length,
      };
    },
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
