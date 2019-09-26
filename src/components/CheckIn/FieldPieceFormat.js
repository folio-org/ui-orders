import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldSelect } from '@folio/stripes-acq-components';

export const PIECE_FORMAT = {
  electronic: 'Electronic',
  physical: 'Physical',
  other: 'Other',
};

const PIECE_FORMAT_OPTIONS = [
  { labelId: 'ui-orders.checkIn.pieceFormat.electronic', value: PIECE_FORMAT.electronic },
  { labelId: 'ui-orders.checkIn.pieceFormat.physical', value: PIECE_FORMAT.physical },
];

const FieldPieceFormat = () => (
  <FieldSelect
    dataOptions={PIECE_FORMAT_OPTIONS}
    label={<FormattedMessage id="ui-orders.checkIn.pieceFormat" />}
    name="format"
    required
  />
);

export default FieldPieceFormat;
