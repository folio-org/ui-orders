import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Checkbox,
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';

import FolioFormattedDate from '../../FolioFormattedDate';

const RenewalsView = ({ order: { renewal = {} } }) => {
  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.renewals.renewalInterval" />}
          value={renewal.interval}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue label={<FormattedMessage id="ui-orders.renewals.renewalDate" />}>
          <FolioFormattedDate value={renewal.renewalDate} />
        </KeyValue>
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.renewals.reviewPeriod" />}
          value={renewal.reviewPeriod}
        />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue label={<FormattedMessage id="ui-orders.renewals.manualRenewal" />}>
          <Checkbox
            checked={renewal.manualRenewal}
            disabled
          />
        </KeyValue>
      </Col>
    </Row>
  );
};

RenewalsView.propTypes = {
  order: PropTypes.object.isRequired,
};

export default RenewalsView;
