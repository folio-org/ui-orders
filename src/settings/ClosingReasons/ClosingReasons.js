import React, { Component } from 'react';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import { stripesShape } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import {
  CLOSING_REASONS_SOURCE,
  DEFAULT_CLOSE_ORDER_REASONS,
  REASONS_FOR_CLOSURE_API,
} from '../../common/constants';

const hiddenFields = ['numberOfObjects', 'lastUpdated'];
const visibleFields = ['reason', 'source'];
const readOnlyFields = ['source'];
const columnMapping = {
  reason: <FormattedMessage id="ui-orders.settings.closingReasons.reason" />,
  source: <FormattedMessage id="ui-orders.settings.closingReasons.source" />,
};

const reasonsLabel = <FormattedMessage id="ui-orders.settings.closingReasons.reason" />;
const formatter = {
  // eslint-disable-next-line react/prop-types
  reason: ({ reason }) => {
    const reasonTranslationKey = DEFAULT_CLOSE_ORDER_REASONS[reason];

    return reasonTranslationKey
      ? (
        <FormattedMessage
          id={`ui-orders.closeOrderModal.closingReasons.${reasonTranslationKey}`}
          defaultMessage={reason}
        />
      )
      : reason || '-';
  },
  // eslint-disable-next-line react/prop-types
  source: ({ source }) => (source
    ? <FormattedMessage id={`ui-orders.settings.closingReasons.${source}`} defaultMessage="-" />
    : '-'
  ),
};

const suppressEdit = ({ source }) => source === CLOSING_REASONS_SOURCE.system;
const suppressDelete = ({ source }) => source === CLOSING_REASONS_SOURCE.system;
const actionSuppressor = { edit: suppressEdit, delete: suppressDelete };

class ClosingReasons extends Component {
  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { intl, stripes } = this.props;

    return (
      <this.connectedControlledVocab
        actionSuppressor={actionSuppressor}
        baseUrl={REASONS_FOR_CLOSURE_API}
        columnMapping={columnMapping}
        data-test-closing-reasons-setting
        editable={stripes.hasPerm('orders.configuration.reasons-for-closure.all')}
        formatter={formatter}
        hiddenFields={hiddenFields}
        id="closingReasons"
        label={intl.formatMessage({ id: 'ui-orders.settings.closingOrderReasons' })}
        translations={getControlledVocabTranslations('ui-orders.settings.closingReasons')}
        nameKey="reason"
        objectLabel={reasonsLabel}
        readOnlyFields={readOnlyFields}
        records="reasonsForClosure"
        sortby="reason"
        stripes={stripes}
        visibleFields={visibleFields}
      />
    );
  }
}

ClosingReasons.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
};

export default injectIntl(ClosingReasons);
