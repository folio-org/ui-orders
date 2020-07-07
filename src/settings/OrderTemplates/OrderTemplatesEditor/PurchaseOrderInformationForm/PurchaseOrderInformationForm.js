import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';
import { AcqUnitsField } from '@folio/stripes-acq-components';

import {
  FieldPrefix,
  FieldSuffix,
  FieldOrganization,
  FieldBillTo,
  FieldShipTo,
  FieldIsManualPO,
  FieldIsReEncumber,
  FieldAssignedTo,
} from '../../../../common/POFields';
import FieldOrderType from '../../../../components/PurchaseOrder/PODetails/FieldOrderType';

const PurchaseOrderInformationForm = ({
  acqUnitIds,
  prefixesSetting,
  suffixesSetting,
  addresses,
  formValues,
  change,
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
        <FieldOrganization
          change={change}
          id={formValues.vendor}
          labelId="ui-orders.orderDetails.vendor"
          name="vendor"
          required={false}
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-assign-to
      >
        <FieldAssignedTo
          change={change}
          assignedToValue={formValues.assignedTo || formValues.assignedToUser}
        />
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
        <FieldOrderType required={false} />
      </Col>

      <Col
        xs={3}
        data-col-order-template-order-units
      >
        <AcqUnitsField
          name="acqUnitIds"
          preselectedUnits={acqUnitIds}
        />
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
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  prefixesSetting: PropTypes.arrayOf(PropTypes.object),
  suffixesSetting: PropTypes.arrayOf(PropTypes.object),
  addresses: PropTypes.arrayOf(PropTypes.object),
  formValues: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
};

export default PurchaseOrderInformationForm;
