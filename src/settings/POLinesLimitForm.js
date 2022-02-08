import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Pane,
  PaneFooter,
  Row,
  TextField,
  HasCommand,
  checkScope,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { handleKeyCommand, usePaneFocus } from '@folio/stripes-acq-components';

import { LINES_LIMIT_DEFAULT } from '../components/Utils/const';

const validateLimit = value => {
  return value === '' || ((value > 0) && (Number.isInteger(+value)) && (value < 1000))
    ? undefined
    : <FormattedMessage id="ui-orders.settings.setPOLInesLimit.validation" />;
};

const POLinesLimitForm = props => {
  const { paneTitleRef } = usePaneFocus();

  const {
    handleSubmit,
    pristine,
    submitting,
    paneTitle,
  } = props;

  const submitButton = (
    <Button
      buttonStyle="primary paneHeaderNewButton"
      disabled={(pristine || submitting)}
      id="set-polines-limit-submit-btn"
      type="submit"
    >
      <FormattedMessage id="ui-orders.settings.saveBtn" />
    </Button>
  );

  const footer = (
    <PaneFooter
      renderEnd={submitButton}
    />
  );

  const shortcuts = [
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <form
        id="po-lines-limit-form"
        onSubmit={handleSubmit}
        style={{ height: '100vh' }}
      >
        <Pane
          defaultWidth="100%"
          fluidContentWidth
          footer={footer}
          paneTitle={paneTitle}
          paneTitleRef={paneTitleRef}
        >
          <Row>
            <Col xs={6}>
              <div>
                <Field
                  component={TextField}
                  label={<FormattedMessage id="ui-orders.settings.setPOLInesLimit" />}
                  name="value"
                  placeholder={LINES_LIMIT_DEFAULT}
                  type="number"
                  validate={validateLimit}
                />
              </div>
            </Col>
          </Row>
        </Pane>
      </form>
    </HasCommand>
  );
};

POLinesLimitForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  paneTitle: PropTypes.node,
};

export default stripesForm({
  form: 'poLinesLimitForm',
  navigationCheck: true,
  enableReinitialize: true,
})(POLinesLimitForm);
