import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

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

const DEFAULT_HIDDEN_FIELDS = {};
const DEFAULT_VENDOR_DETAIL = {};

const VendorView = ({
  hiddenFields = DEFAULT_HIDDEN_FIELDS,
  vendorDetail = DEFAULT_VENDOR_DETAIL,
  vendorId,
}) => {
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
  hiddenFields: PropTypes.object,
  vendorDetail: PropTypes.object,
  vendorId: PropTypes.string,
};

export default VendorView;
