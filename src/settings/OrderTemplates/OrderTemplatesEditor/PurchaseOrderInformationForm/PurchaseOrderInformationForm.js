import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import {
  FieldPrefix,
  FieldSuffix,
  FieldVendor,
  FieldBillTo,
  FieldShipTo,
  FieldIsManualPO,
  FieldIsReEncumber,
} from '../../../../common/POFields';
import FieldOrderType from '../../../../components/PurchaseOrder/PODetails/FieldOrderType';

const PurchaseOrderInformationForm = ({
  prefixesSetting,
  suffixesSetting,
  addresses,
  vendors,
}) => {
  return (
    <Row>
      <Col
        xs={3}
        data-col-order-template-prefix
      >
        <FieldPrefix prefixes={prefixesSetting} />
      </Col>

      <Col
        xs={3}
        data-col-order-template-suffix
      >
        <FieldSuffix suffixes={suffixesSetting} />
      </Col>

      <Col
        xs={3}
        data-col-order-template-vendor
      >
        <FieldVendor vendors={vendors} />
      </Col>

      <Col
        xs={3}
        data-col-order-template-assign-to
      >
        Assign to (TBD)
      </Col>

      <Col
        xs={3}
        data-col-order-template-bill-to
      >
        <FieldBillTo addresses={addresses} />
      </Col>

      <Col
        xs={3}
        data-col-order-template-ship-to
      >
        <FieldShipTo addresses={addresses} />
      </Col>

      <Col
        xs={3}
        data-col-order-template-order-type
      >
        <FieldOrderType />
      </Col>

      <Col
        xs={3}
        data-col-order-template-manual
      >
        <FieldIsManualPO />
      </Col>

      <Col
        xs={3}
        data-col-order-template-reencumber
      >
        <FieldIsReEncumber />
      </Col>
    </Row>
  );
};

PurchaseOrderInformationForm.propTypes = {
  prefixesSetting: PropTypes.arrayOf(PropTypes.object),
  suffixesSetting: PropTypes.arrayOf(PropTypes.object),
  addresses: PropTypes.arrayOf(PropTypes.object),
  vendors: PropTypes.arrayOf(PropTypes.object),
};

export default PurchaseOrderInformationForm;
