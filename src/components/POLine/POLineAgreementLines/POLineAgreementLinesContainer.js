import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  Loading,
} from '@folio/stripes/components';
import {
  baseManifest,
  LIMIT_MAX,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { AGREEMENT_LINES_API } from '../../Utils/api';
import POLineAgreementLines from './POLineAgreementLines';

const POLineAgreementLinesContainer = ({ lineId, label, mutator }) => {
  const [agreementLines, setAgreementLines] = useState();
  const showCallout = useShowCallout();

  useEffect(() => {
    setAgreementLines();

    mutator.agreementLines.GET({
      params: {
        filters: `poLines.poLineId==${lineId}`,
        perPage: LIMIT_MAX,
      },
    })
      .then(setAgreementLines)
      .catch(() => {
        showCallout({ messageId: 'ui-orders.relatedAgreementLines.actions.load.error', type: 'error' });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId]);

  if (!agreementLines) return <Loading />;

  return (
    <POLineAgreementLines
      agreementLines={agreementLines}
      label={label}
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
