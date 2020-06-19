import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  Loading,
} from '@folio/stripes/components';
import {
  baseManifest,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { AGREEMENT_LINES_API } from '../../Utils/api';
import POLineAgreementLines from './POLineAgreementLines';

const POLineAgreementLinesContainer = ({ lineId, label, mutator }) => {
  const [agreementLines, setAgreementLines] = useState();
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const showCallout = useShowCallout();

  const fetchAgeementLines = useCallback(
    (nextPage) => {
      mutator.agreementLines.GET({
        params: {
          filters: `poLines.poLineId==${lineId}`,
          stats: true,
          page: nextPage,
        },
      })
        .then(agreementLinesResp => {
          setAgreementLines(prev => [...(prev || []), ...agreementLinesResp.results]);
          setTotalCount(agreementLinesResp.totalRecords);
          setPage(nextPage);
        })
        .catch(() => {
          showCallout({ messageId: 'ui-orders.relatedAgreementLines.actions.load.error', type: 'error' });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showCallout, lineId],
  );

  const refreshList = useCallback(
    () => {
      setPage(1);
      setAgreementLines();
      setTotalCount(0);
      fetchAgeementLines(1);
    },
    [fetchAgeementLines],
  );

  useEffect(refreshList, [lineId]);

  const onNeedMoreData = useCallback(
    () => {
      const nextPage = page + 1;

      fetchAgeementLines(nextPage);
    },
    [page, fetchAgeementLines],
  );

  if (!(agreementLines || totalCount)) return <Loading />;

  return (
    <POLineAgreementLines
      agreementLines={agreementLines}
      label={label}
      onNeedMoreData={onNeedMoreData}
      totalCount={totalCount}
    />
  );
};

POLineAgreementLinesContainer.propTypes = {
  lineId: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  mutator: PropTypes.object.isRequired,
};

POLineAgreementLinesContainer.manifest = Object.freeze({
  agreementLines: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
    path: AGREEMENT_LINES_API,
  },
});

export default stripesConnect(POLineAgreementLinesContainer);
