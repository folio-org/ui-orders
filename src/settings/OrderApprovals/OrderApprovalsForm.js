import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Pane,
  Row,
  Checkbox,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

const OrderApprovalsForm = props => {
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
      id="set-order-approvals-submit-btn"
      marginBottom0
      type="submit"
    >
      <FormattedMessage id="ui-orders.settings.saveBtn" />
    </Button>
  );

  return (
    <form id="order-approvals-form" onSubmit={handleSubmit}>
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
                component={Checkbox}
                label={<FormattedMessage id="ui-orders.settings.setOrderApprovals" />}
                name="isApprovals"
              />
            </div>
          </Col>
        </Row>
      </Pane>
    </form>
  );
};

OrderApprovalsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  paneTitle: PropTypes.node,
};

export default stripesForm({
  form: 'orderApprovalsForm',
  navigationCheck: true,
  enableReinitialize: true,
})(OrderApprovalsForm);
