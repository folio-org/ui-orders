import React, { Component } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import { stripesShape } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

import { PREFIXES_API } from '../../common/constants';

const prefixColumnMapping = {
  name: <FormattedMessage id="ui-orders.settings.poNumber.modifier.name" />,
  description: <FormattedMessage id="ui-orders.settings.poNumber.modifier.description" />,
};
const prefixHiddenFields = ['numberOfObjects', 'lastUpdated'];
const prefixVisibleFields = ['name', 'description'];

class Prefixes extends Component {
  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;

    return (
      <this.connectedControlledVocab
        baseUrl={PREFIXES_API}
        columnMapping={prefixColumnMapping}
        editable
        hiddenFields={prefixHiddenFields}
        id="prefixes"
        label={intl.formatMessage({ id: 'ui-orders.settings.poNumber.prefixes' })}
        labelSingular={intl.formatMessage({ id: 'ui-orders.settings.poNumber.prefix' })}
        nameKey="name"
        objectLabel={intl.formatMessage({ id: 'ui-orders.settings.poNumber.prefix' })}
        records="prefixes"
        sortby="name"
        stripes={stripes}
        visibleFields={prefixVisibleFields}
      />
    );
  }
}

Prefixes.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default injectIntl(Prefixes);
