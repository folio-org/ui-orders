import { useMutation } from 'react-query';
import { chunk } from 'lodash';

import { useOkapiKy } from '@folio/stripes/core';
import { LINES_API } from '@folio/stripes-acq-components';

const CHUNK_SIZE = 5;

export const useReexport = () => {
  const ky = useOkapiKy();

  const mutationFn = async (poLines = []) => {
    const exportedLines = chunk(poLines.filter(({ lastEDIExportDate }) => lastEDIExportDate), CHUNK_SIZE);

    return exportedLines.reduce(async (acc, linesChunk) => {
      await acc;

      return Promise.all(linesChunk.map(line => {
        return ky.put(`${LINES_API}/${line.id}`, {
          json: {
            ...line,
            lastEDIExportDate: null,
          },
        }).json();
      }));
    }, Promise.resolve());
  };

  const {
    isLoading,
    mutateAsync,
  } = useMutation({ mutationFn });

  return {
    isLoading,
    reExport: mutateAsync,
  };
};
