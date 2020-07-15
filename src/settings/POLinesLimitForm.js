import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Pane,
  Row,
  TextField,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import { LINES_LIMIT_DEFAULT } from '../components/Utils/const';

const validateLimit = value => {
  return value === '' || ((value > 0) && (Number.isInteger(+value)) && (value < 1000))
    ? undefined
    : <FormattedMessage id="ui-orders.settings.setPOLInesLimit.validation" />;
};

const POLinesLimitForm = props => {
  const {
    handleSubmit,
    pristine,
    submitting,
    paneTitle,
  } = props;

  const lastMenu = (
    <Button
      buttonStyle="primary paneHeaderNewButton"
      disabled={(pristine || submitting)}
      id="set-polines-limit-submit-btn"
      marginBottom0
      type="submit"
    >
      <FormattedMessage id="ui-orders.settings.saveBtn" />
    </Button>
  );

  return (
    <form id="po-lines-limit-form" onSubmit={handleSubmit}>
      <Pane
        defaultWidth="100%"
        fluidContentWidth
        lastMenu={lastMenu}
        paneTitle={paneTitle}
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
