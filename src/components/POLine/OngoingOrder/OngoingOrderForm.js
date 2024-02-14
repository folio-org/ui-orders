import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import {
  Col,
  Row,
  TextArea,
} from '@folio/stripes/components';
import {
  IfFieldVisible,
  VisibilityControl,
} from '@folio/stripes-acq-components';

const OngoingOrderForm = ({ hiddenFields = {} }) => {
  return (
    <Row>
      <IfFieldVisible visible={!hiddenFields.renewalNote} name="renewalNote">
        <Col
          xs={6}
          md={3}
        >
          <VisibilityControl name="hiddenFields.renewalNote">
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="ui-orders.poLine.renewalNote" />}
              name="renewalNote"
              validateFields={[]}
            />
          </VisibilityControl>
        </Col>
      </IfFieldVisible>
    </Row>
  );
};

OngoingOrderForm.propTypes = {
  hiddenFields: PropTypes.object,
};

export default OngoingOrderForm;
