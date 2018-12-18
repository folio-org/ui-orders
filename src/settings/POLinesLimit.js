import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import {
  Callout,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import POLinesLimitForm from './POLinesLimitForm';

class POLinesLimit extends Component {
  static manifest = Object.freeze({
    recordId: {},
    setPOLinesLimit: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=ORDERS and configName=poLines-limit)',
      POST: {
        path: 'configurations/entries',
      },
      PUT: {
        path: 'configurations/entries/%{recordId}',
      },
    },
  });

  static propTypes = {
    label: PropTypes.string.isRequired,
    mutator: PropTypes.shape({
      setPOLinesLimit: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
      recordId: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      setPOLinesLimit: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
  };

  constructor(props) {
    super(props);

    this.styles = {
      poLineLimitFormWrapper: {
        width: '100%',
      },
    };
  }

  onChangePOLinesLimitFormSubmit = values => {
    const record = this.props.resources.setPOLinesLimit.records[0];
    const { setPOLinesLimit, recordId } = this.props.mutator;
    const polinesLimit = values.records[0].value;

    if (record) {
      recordId.replace(record.id);
      record.value = polinesLimit;
      setPOLinesLimit
        .PUT(record)
        .then(() => {
          this.handleChangePOLinesLimitSuccess();
        });
    } else {
      setPOLinesLimit
        .POST({
          module: 'ORDERS',
          configName: 'poLines-limit',
          value: polinesLimit,
        })
        .then(() => {
          this.handleChangePOLinesLimitSuccess();
        });
    }
  }

  handleChangePOLinesLimitSuccess = () => {
    const successMessage = (
      <SafeHTMLMessage id="ui-orders.settings.setPOLInesLimit.changed" />
    );
    this.callout.sendCallout({ message: successMessage });
  };

  createCalloutRef = ref => {
    this.callout = ref;
  };

  validateField = value => {
    return ((value > 0) && (Number.isInteger(+value)) && (value < 1000))
      ? undefined
      : <FormattedMessage id="ui-orders.settings.setPOLInesLimit.validatation" />;
  };

  render() {
    const { label, resources } = this.props;

    return (
      <div style={this.styles.poLineLimitFormWrapper}>
        <POLinesLimitForm
          initialValues={resources.setPOLinesLimit}
          onSubmit={this.onChangePOLinesLimitFormSubmit}
          saveButtonText={<FormattedMessage id="ui-orders.settings.saveBtn" />}
          title={label}
        >
          <Row>
            <Col xs={6}>
              <div>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-orders.settings.setPOLInesLimit" />}
                  name="records[0].value"
                  type="number"
                  validate={this.validateField}
                />
              </div>
            </Col>
          </Row>
        </POLinesLimitForm>
        <Callout ref={this.createCalloutRef} />
      </div>
    );
  }
}

export default POLinesLimit;
