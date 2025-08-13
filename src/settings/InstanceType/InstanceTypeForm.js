import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { FieldSelectFinal } from '@folio/stripes-acq-components';

import { CONFIG_INSTANCE_TYPE } from '../../common/constants';

const InstanceTypeForm = ({ instanceTypes }) => (
  <Row>
    <Col xs={6}>
      <FieldSelectFinal
        dataOptions={instanceTypes}
        fullWidth
        label={<FormattedMessage id="ui-orders.settings.instanceType.select" />}
        name={CONFIG_INSTANCE_TYPE}
        required
      />
    </Col>
  </Row>
);

InstanceTypeForm.propTypes = {
  instanceTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

export default InstanceTypeForm;
