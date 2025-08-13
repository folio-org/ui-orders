import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  CONFIG_LOAN_TYPE,
  FieldSelectFinal,
} from '@folio/stripes-acq-components';

const LoanTypeForm = ({ loanTypes }) => (
  <Row>
    <Col xs={6}>
      <FieldSelectFinal
        dataOptions={loanTypes}
        fullWidth
        label={<FormattedMessage id="ui-orders.settings.loanType.select" />}
        name={CONFIG_LOAN_TYPE}
        required
      />
    </Col>
  </Row>
);

LoanTypeForm.propTypes = {
  loanTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

export default LoanTypeForm;
