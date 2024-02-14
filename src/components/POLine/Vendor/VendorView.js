import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  IfVisible,
  VendorReferenceNumbersDetails,
} from '@folio/stripes-acq-components';

import { useVendor } from '../../../common/hooks';

const VendorView = ({ vendorDetail, vendorId, hiddenFields }) => {
  const { vendor } = useVendor(vendorId);

  const accountNumber = vendorDetail?.vendorAccount;
  const vendorAccount = useMemo(() => {
    if (vendor?.accounts?.length) {
      const account = vendor.accounts.find(({ accountNo }) => accountNo === accountNumber);

      return account ? `${account.name} (${account.accountNo})` : accountNumber;
    }

    return accountNumber;
  }, [accountNumber, vendor]);

  return (
    <Row start="xs">
      <Col xs={12}>
        <KeyValue label={<FormattedMessage id="ui-orders.vendor.referenceNumbers" />}>
          <VendorReferenceNumbersDetails referenceNumbers={vendorDetail.referenceNumbers} />
        </KeyValue>
      </Col>

      <IfVisible visible={!hiddenFields.vendorDetail?.instructions}>
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
      </IfVisible>

      <IfVisible visible={!hiddenFields.vendorDetail?.vendorAccount}>
        <Col
          data-col-vendor-view-account-number
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.vendor.accountNumber" />}
            value={vendorAccount}
          />
        </Col>
      </IfVisible>
    </Row>
  );
};

VendorView.propTypes = {
  vendorDetail: PropTypes.object,
  vendorId: PropTypes.string,
  hiddenFields: PropTypes.object,
};

VendorView.defaultProps = {
  vendorDetail: {},
  hiddenFields: {},
};

export default VendorView;
