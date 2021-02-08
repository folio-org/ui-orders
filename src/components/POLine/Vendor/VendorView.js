import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { VendorReferenceNumbersDetails } from '@folio/stripes-acq-components';

const VendorView = ({ vendorDetail }) => (
  <Row start="xs">
    <Col xs={12}>
      <KeyValue label={<FormattedMessage id="ui-orders.vendor.referenceNumbers" />}>
        <VendorReferenceNumbersDetails referenceNumbers={vendorDetail.referenceNumbers} />
      </KeyValue>
    </Col>
    <Col
      data-col-vendor-view-instructions
      xs={6}
      lg={3}
    >
      <KeyValue
        label={<FormattedMessage id="ui-orders.vendor.instructions" />}
        value={get(vendorDetail, 'instructions')}
      />
    </Col>
    <Col
      data-col-vendor-view-account-number
      xs={6}
      lg={3}
    >
      <KeyValue
        label={<FormattedMessage id="ui-orders.vendor.accountNumber" />}
        value={get(vendorDetail, 'vendorAccount')}
      />
    </Col>
  </Row>
);

VendorView.propTypes = {
  vendorDetail: PropTypes.object,
};

VendorView.defaultProps = {
  vendorDetail: {},
};

export default VendorView;
