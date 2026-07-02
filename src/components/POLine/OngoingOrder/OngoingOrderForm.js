import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  InfoPopover,
  Row,
  TextArea,
} from '@folio/stripes/components';
import {
  IfFieldVisible,
  VisibilityControl,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../common/constants';

const OngoingOrderForm = ({ hiddenFields = {} }) => {
  return (
    <Row>
      <IfFieldVisible
        visible={!hiddenFields.renewalNote}
        name={POL_FORM_FIELDS.renewalNote}
      >
        <Col
          xs={6}
          md={3}
        >
          <VisibilityControl name="hiddenFields.renewalNote">
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="ui-orders.poLine.renewalNote" />}
              name={POL_FORM_FIELDS.renewalNote}
              validateFields={[]}
            />
          </VisibilityControl>
        </Col>
      </IfFieldVisible>

      <IfFieldVisible
        visible={!hiddenFields.multiYearPayment}
        name={POL_FORM_FIELDS.multiYearPayment}
      >
        <Col
          xs={6}
          md={3}
        >
          <VisibilityControl name="hiddenFields.multiYearPayment">
            <Field
              component={Checkbox}
              fullWidth
              label={(
                <>
                  <FormattedMessage id="ui-orders.poLine.multiYearPayment" />
                  <InfoPopover content={<FormattedMessage id="ui-orders.poLine.multiYearPayment.infoPopover" />} />
                </>
              )}
              name={POL_FORM_FIELDS.multiYearPayment}
              type="checkbox"
              validateFields={[]}
              vertical
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
