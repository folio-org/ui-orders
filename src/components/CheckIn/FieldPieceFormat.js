import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FieldSelect } from '@folio/stripes-acq-components';

import { Required } from '../Utils/Validate';

export const PIECE_FORMAT = {
  electronic: 'Electronic',
  physical: 'Physical',
  other: 'Other',
};

const PIECE_FORMAT_OPTIONS = [
  { label: 'ui-orders.checkIn.pieceFormat.electronic', value: PIECE_FORMAT.electronic },
  { label: 'ui-orders.checkIn.pieceFormat.physical', value: PIECE_FORMAT.physical },
];

const FieldPieceFormat = () => (
  <FieldSelect
    dataOptions={PIECE_FORMAT_OPTIONS}
    fullWidth
    label={<FormattedMessage id="ui-orders.checkIn.pieceFormat" />}
    name="format"
    required
    validate={Required}
  />
);

export default FieldPieceFormat;
