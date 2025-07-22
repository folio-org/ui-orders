import React, { Component } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  stripesShape,
  TitleManager,
} from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  getControlledVocabTranslations,
  SUFFIXES_API,
} from '@folio/stripes-acq-components';
import { Checkbox } from '@folio/stripes/components';

import {
  formatSuffixDeprecated,
  validateSuffixName,
} from '../utils';

const suffixColumnMapping = {
  name: <FormattedMessage id="ui-orders.settings.poNumber.modifier.name" />,
  description: <FormattedMessage id="ui-orders.settings.poNumber.modifier.description" />,
  deprecated: <FormattedMessage id="ui-orders.settings.poNumber.modifier.deprecated" />,
};
const suffixVisibleFields = ['name', 'description', 'deprecated'];
const suffixHiddenFields = ['numberOfObjects', 'lastUpdated'];

const checkboxFieldType = ({ fieldProps }) => (
  <Field
    {...fieldProps}
    component={Checkbox}
    type='checkbox'
  />
);

const fieldComponents = {
  deprecated: checkboxFieldType,
};

const formatter = {
  deprecated: formatSuffixDeprecated,
};

class Suffixes extends Component {
  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;

    return (
      <TitleManager record={intl.formatMessage({ id: 'ui-orders.settings.poNumber.suffixes' })}>
        <this.connectedControlledVocab
          formType='final-form'
          baseUrl={SUFFIXES_API}
          columnMapping={suffixColumnMapping}
          editable
          id="suffixes"
          label={intl.formatMessage({ id: 'ui-orders.settings.poNumber.suffixes' })}
          translations={getControlledVocabTranslations('ui-orders.settings.poNumber.suffix')}
          nameKey="name"
          objectLabel={intl.formatMessage({ id: 'ui-orders.settings.poNumber.suffix' })}
          records="suffixes"
          sortby="name"
          stripes={stripes}
          hiddenFields={suffixHiddenFields}
          visibleFields={suffixVisibleFields}
          validate={validateSuffixName}
          fieldComponents={fieldComponents}
          formatter={formatter}
        />
      </TitleManager>
    );
  }
}

Suffixes.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default injectIntl(Suffixes);
