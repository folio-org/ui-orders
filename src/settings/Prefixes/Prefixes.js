import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import {
  stripesShape,
  TitleManager,
} from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  getControlledVocabTranslations,
  PREFIXES_API,
} from '@folio/stripes-acq-components';
import { Checkbox } from '@folio/stripes/components';

import {
  formatPrefixDeprecated,
  validatePrefixName,
} from '../utils';

const prefixColumnMapping = {
  name: <FormattedMessage id="ui-orders.settings.poNumber.modifier.name" />,
  description: <FormattedMessage id="ui-orders.settings.poNumber.modifier.description" />,
  deprecated: <FormattedMessage id="ui-orders.settings.poNumber.modifier.deprecated" />,
};
const prefixHiddenFields = ['numberOfObjects', 'lastUpdated'];
const prefixVisibleFields = ['name', 'description', 'deprecated'];

const checkboxFieldType = ({ fieldProps }) => (
  <Field
    {...fieldProps}
    component={Checkbox}
    type="checkbox"
  />
);

const fieldComponents = {
  deprecated: checkboxFieldType,
};

const formatter = {
  deprecated: formatPrefixDeprecated,
};

class Prefixes extends Component {
  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.poNumber.prefixes' })}>
        <this.connectedControlledVocab
          formType="final-form"
          baseUrl={PREFIXES_API}
          columnMapping={prefixColumnMapping}
          editable
          hiddenFields={prefixHiddenFields}
          id="prefixes"
          label={intl.formatMessage({ id: 'ui-orders.settings.poNumber.prefixes' })}
          translations={getControlledVocabTranslations('ui-orders.settings.poNumber.prefix')}
          nameKey="name"
          objectLabel={intl.formatMessage({ id: 'ui-orders.settings.poNumber.prefix' })}
          records="prefixes"
          sortby="name"
          stripes={stripes}
          visibleFields={prefixVisibleFields}
          validate={validatePrefixName}
          fieldComponents={fieldComponents}
          formatter={formatter}
        />
      </TitleManager>
    );
  }
}

Prefixes.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default injectIntl(Prefixes);
