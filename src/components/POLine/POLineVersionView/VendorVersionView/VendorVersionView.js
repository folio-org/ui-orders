import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { VendorReferenceNumbersDetails } from '@folio/stripes-acq-components';

import { VersionKeyValue } from '../../../../common/VersionView';

export const VendorVersionView = ({ version }) => {
  const vendorDetail = version?.vendorDetail;

  return (
    <>
      <Row start="xs">
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.vendor.referenceNumbers" />}
            value={(
              <VendorReferenceNumbersDetails
                name="vendorDetail.referenceNumbers"
                referenceNumbers={vendorDetail?.referenceNumbers}
              />
            )}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="vendorDetail.instructions"
            label={<FormattedMessage id="ui-orders.vendor.instructions" />}
            value={vendorDetail?.instructions}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="vendorDetail.vendorAccount"
            label={<FormattedMessage id="ui-orders.vendor.accountNumber" />}
            value={vendorDetail?.vendorAccount}
          />
        </Col>
      </Row>
    </>
  );
};

VendorVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
