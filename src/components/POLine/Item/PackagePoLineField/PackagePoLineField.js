import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { TextField } from '@folio/stripes/components';
import { Pluggable, stripesConnect } from '@folio/stripes/core';
import { LINES_API } from '@folio/stripes-acq-components';

function PackagePoLineField({ disabled, poLineId, resources, onSelectLine }) {
  const { id, titleOrPackage } = resources?.linkedPoLine?.records?.[0] ?? {};
  const title = poLineId && poLineId === id && titleOrPackage;
  const onClearField = useCallback(() => onSelectLine([]), [onSelectLine]);

  return (
    <>
      <TextField
        fullWidth
        label={<FormattedMessage id="ui-orders.itemDetails.linkPackage" />}
        marginBottom0
        onClearField={onClearField}
        value={title || ''}
      />
      {!disabled && (
        <Pluggable
          addLines={onSelectLine}
          aria-haspopup="true"
          dataKey="find-po-line"
          filters="isPackage.true"
          initialFilterState={{ isPackage: ['true'] }}
          isSingleSelect
          searchButtonStyle="link"
          searchLabel={<FormattedMessage id="ui-orders.itemDetails.linkPackageLookUp" />}
          type="find-po-line"
        >
          <FormattedMessage id="ui-orders.find-po-line-plugin-unavailable" />
        </Pluggable>
      )}
    </>
  );
}

PackagePoLineField.manifest = Object.freeze({
  linkedPoLine: {
    path: `${LINES_API}/!{poLineId}`,
    throwErrors: false,
    type: 'okapi',
  },
});

PackagePoLineField.propTypes = {
  disabled: PropTypes.bool,
  onSelectLine: PropTypes.func.isRequired,
  poLineId: PropTypes.string,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(PackagePoLineField, { dataKey: 'linkedPoLine' });
