import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { stripesConnect } from '@folio/stripes/core';
import { LINES_API } from '@folio/stripes-acq-components';

function LinkToPoLine({ poLineId, resources }) {
  const { id, titleOrPackage } = resources?.linkedPoLine?.records?.[0] ?? {};

  return poLineId && poLineId === id
    ? (
      <Link to={`/orders/lines/view/${poLineId}`}>
        {titleOrPackage}
      </Link>
    )
    : '-';
}

LinkToPoLine.manifest = Object.freeze({
  linkedPoLine: {
    path: `${LINES_API}/!{poLineId}`,
    throwErrors: false,
    type: 'okapi',
  },
});

LinkToPoLine.propTypes = {
  poLineId: PropTypes.string,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(LinkToPoLine, { dataKey: 'linkedPoLine' });
