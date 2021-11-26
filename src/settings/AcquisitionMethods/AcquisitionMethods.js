import React, { Component } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import { stripesShape } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { ACQUISITION_METHODS_API } from '@folio/stripes-acq-components';

const columnMapping = {
  value: <FormattedMessage id="ui-orders.settings.acquisitionMethods.name" />,
};
const visibleFields = ['value'];
const hiddenFields = ['numberOfObjects', 'lastUpdated'];

class AcquisitionMethods extends Component {
  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;

    return (
      <this.connectedControlledVocab
        id="acquisition-methods"
        baseUrl={ACQUISITION_METHODS_API}
        records="acquisition_methods"
        sortby="value"
        nameKey="value"
        editable={stripes.hasPerm('ui-orders.settings.all')}
        label={intl.formatMessage({ id: 'ui-orders.settings.acquisitionMethods' })}
        labelSingular={intl.formatMessage({ id: 'ui-orders.settings.acquisitionMethods.singular' })}
        columnMapping={columnMapping}
        objectLabel={intl.formatMessage({ id: 'ui-orders.settings.acquisitionMethods.singular' })}
        hiddenFields={hiddenFields}
        visibleFields={visibleFields}
        stripes={stripes}
      />
    );
  }
}

AcquisitionMethods.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default injectIntl(AcquisitionMethods);
