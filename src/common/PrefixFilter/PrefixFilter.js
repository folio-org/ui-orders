import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { SelectionFilter } from '@folio/stripes-acq-components';

import { prefixesResource } from '../resources';

function PrefixFilter({ resources, ...rest }) {
  const options = resources.prefixesSetting.records?.map(({ name }) => ({ label: name, value: name }));

  return (
    <SelectionFilter
      {...rest}
      options={options}
    />
  );
}

PrefixFilter.manifest = Object.freeze({
  prefixesSetting: prefixesResource,
});

PrefixFilter.propTypes = {
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(PrefixFilter);
