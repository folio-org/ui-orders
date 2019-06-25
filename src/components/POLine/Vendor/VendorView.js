import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const VendorView = ({ vendorDetail }) => (
  <Row start="xs">
    <Col
      data-col-vendor-view-refnumber
      xs={6}
      lg={3}
    >
      <KeyValue
        label={<FormattedMessage id="ui-orders.vendor.refNumber" />}
        value={get(vendorDetail, 'refNumber')}
      />
    </Col>
    <Col
      data-col-vendor-view-refnumber-type
      xs={6}
      lg={3}
    >
      <KeyValue
        label={<FormattedMessage id="ui-orders.vendor.refNumberType" />}
        value={get(vendorDetail, 'refNumberType')}
      />
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
    <Col
      data-col-vendor-view-note
      xs={6}
      lg={3}
    >
      <KeyValue
        label={<FormattedMessage id="ui-orders.vendor.noteFromVendor" />}
        value={get(vendorDetail, 'noteFromVendor')}
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
