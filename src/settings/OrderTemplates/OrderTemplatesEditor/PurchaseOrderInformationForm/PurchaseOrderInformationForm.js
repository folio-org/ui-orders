import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';
import {
  AcqUnitsField,
  FieldOrganization,
} from '@folio/stripes-acq-components';

import {
  FieldPrefix,
  FieldSuffix,
  FieldBillTo,
  FieldShipTo,
  FieldIsManualPO,
  FieldIsReEncumber,
  FieldAssignedTo,
} from '../../../../common/POFields';
import FieldOrderType from '../../../../components/PurchaseOrder/PODetails/FieldOrderType';
import { VisibilityControl } from '../../../../common/VisibilityControl';

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
        <VisibilityControl name="hiddenFields.poNumberPrefix">
          <FieldPrefix prefixes={prefixesSetting} />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-suffix
      >
        <VisibilityControl name="hiddenFields.poNumberSuffix">
          <FieldSuffix suffixes={suffixesSetting} />
        </VisibilityControl>
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
        <VisibilityControl name="hiddenFields.assignedTo">
          <FieldAssignedTo
            change={change}
            userId={formValues?.assignedTo}
          />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-bill-to
      >
        <VisibilityControl name="hiddenFields.billTo">
          <FieldBillTo addresses={addresses} />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-ship-to
      >
        <VisibilityControl name="hiddenFields.shipTo">
          <FieldShipTo addresses={addresses} />
        </VisibilityControl>
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
        <VisibilityControl
          control
          name="hiddenFields.acqUnitIds"
        >
          <AcqUnitsField
            id="po-acq-units"
            isFinal
            name="acqUnitIds"
            preselectedUnits={acqUnitIds}
          />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-manual
      >
        <VisibilityControl name="hiddenFields.manualPo">
          <FieldIsManualPO />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-reencumber
      >
        <VisibilityControl name="hiddenFields.reEncumber">
          <FieldIsReEncumber />
        </VisibilityControl>
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
