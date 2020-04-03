import React, { Component } from 'react';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';

import { SUFFIXES_API } from '../../common/constants';

const suffixColumnMapping = {
  name: <FormattedMessage id="ui-orders.settings.poNumber.modifier.name" />,
  description: <FormattedMessage id="ui-orders.settings.poNumber.modifier.description" />,
};
const suffixVisibleFields = ['name', 'description'];
const suffixHiddenFields = ['numberOfObjects', 'lastUpdated'];

class Suffixes extends Component {
  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;

    return (
      <this.connectedControlledVocab
        baseUrl={SUFFIXES_API}
        columnMapping={suffixColumnMapping}
        editable
        id="suffixes"
        label={intl.formatMessage({ id: 'ui-orders.settings.poNumber.suffixes' })}
        labelSingular={intl.formatMessage({ id: 'ui-orders.settings.poNumber.suffix' })}
        nameKey="name"
        objectLabel={intl.formatMessage({ id: 'ui-orders.settings.poNumber.suffix' })}
        records="suffixes"
        sortby="name"
        stripes={stripes}
        hiddenFields={suffixHiddenFields}
        visibleFields={suffixVisibleFields}
      />
    );
  }
}

Suffixes.propTypes = {
  intl: intlShape.isRequired,
  stripes: stripesShape.isRequired,
};

export default injectIntl(Suffixes);
