import PropTypes from 'prop-types';
import { useCallback } from 'react';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  AcqUnitsField,
  FieldOrganization,
  VisibilityControl,
} from '@folio/stripes-acq-components';

import {
  PO_FORM_FIELDS,
  POL_FORM_FIELDS,
} from '../../../../common/constants';
import {
  FieldAssignedTo,
  FieldBillTo,
  FieldIsManualPO,
  FieldIsReEncumber,
  FieldPrefix,
  FieldShipTo,
  FieldSuffix,
} from '../../../../common/POFields';
import FieldOrderType from '../../../../components/PurchaseOrder/PODetails/FieldOrderType';

const PurchaseOrderInformationForm = ({
  acqUnitIds,
  addresses,
  change,
  formValues,
  prefixesSetting,
  suffixesSetting,
}) => {
  const onManualPOChange = useCallback(({ target: { checked } }) => {
    change(PO_FORM_FIELDS.manualPo, checked);

    if (checked) {
      change(POL_FORM_FIELDS.automaticExport, false);
    }
  }, [change]);

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
          name={PO_FORM_FIELDS.vendor}
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
            name={PO_FORM_FIELDS.acqUnitIds}
            preselectedUnits={acqUnitIds}
          />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-manual
      >
        <VisibilityControl name="hiddenFields.manualPo">
          <FieldIsManualPO onChange={onManualPOChange} />
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
  addresses: PropTypes.arrayOf(PropTypes.object),
  change: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  prefixesSetting: PropTypes.arrayOf(PropTypes.object),
  suffixesSetting: PropTypes.arrayOf(PropTypes.object),
};

export default PurchaseOrderInformationForm;
