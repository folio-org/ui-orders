import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get, toString } from 'lodash';
import PropTypes from 'prop-types';
import {
  KeyValue,
} from '@folio/stripes/components';

const MaterialType = ({ materialTypes, materialTypesIds }) => {
  const typesOptions = get(materialTypes, 'records', []);
  const value = toString(
    materialTypesIds.map((typeId) => get(typesOptions.find((o) => o.id === typeId), 'name', ''))
  );

  return (
    <KeyValue
      label={<FormattedMessage id="ui-orders.itemDetails.materialTypes" />}
      value={value}
    />
  );
};

MaterialType.propTypes = {
  materialTypes: PropTypes.object.isRequired,
  materialTypesIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MaterialType;
