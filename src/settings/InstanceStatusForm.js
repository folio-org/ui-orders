import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { FieldSelect } from '@folio/stripes-acq-components';

import { CONFIG_INSTANCE_STATUS } from '../common/constants';

const InstanceStatusForm = ({ instanceStatuses }) => (
  <Row>
    <Col xs={6}>
      <FieldSelect
        dataOptions={instanceStatuses}
        fullWidth
        label={<FormattedMessage id="ui-orders.settings.instanceStatus.select" />}
        name={CONFIG_INSTANCE_STATUS}
        required
      />
    </Col>
  </Row>
);

InstanceStatusForm.propTypes = {
  instanceStatuses: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

export default InstanceStatusForm;
