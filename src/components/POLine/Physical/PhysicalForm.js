import React from 'react';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { IfFieldVisible } from '@folio/stripes-acq-components';

import {
  FieldMaterialSupplier,
  FieldMaterialType,
  FieldReceiptDue,
  FieldExpectedReceiptDate,
  FieldsVolume,
} from '../../../common/POLFields';
import {
  isWorkflowStatusClosed,
  isWorkflowStatusIsPending,
} from '../../PurchaseOrder/util';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import { isMaterialTypeRequired } from '../../Utils/Validate';

const PhysicalForm = ({ order, materialTypes, formValues, change, hiddenFields = {} }) => {
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isClosedOrder = isWorkflowStatusClosed(order);

  return (
    <>
      <Row>
        <IfFieldVisible visible={!hiddenFields.physical?.materialSupplier} name="physical.materialSupplier">
          <Col
            xs={6}
            md={3}
          >
            <FieldMaterialSupplier
              materialSupplierId={formValues?.physical?.materialSupplier}
              disabled={isClosedOrder}
              change={change}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.physical?.receiptDue} name="physical.receiptDue">
          <Col
            xs={6}
            md={3}
          >
            <FieldReceiptDue />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.physical?.expectedReceiptDate} name="physical.expectedReceiptDate">
          <Col
            xs={6}
            md={3}
          >
            <FieldExpectedReceiptDate />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.physical?.createInventory} name="physical.createInventory">
          <Col
            xs={6}
            md={3}
          >
            <InventoryRecordTypeSelectField
              label="ui-orders.physical.createInventory"
              name="physical.createInventory"
              isNonInteractive={isPostPendingOrder}
              required
              isBindaryActive={formValues?.details?.isBindaryActive}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.physical?.materialType} name="physical.materialType">
          <Col
            xs={6}
            md={3}
          >
            <FieldMaterialType
              materialTypes={materialTypes}
              name="physical.materialType"
              required={isMaterialTypeRequired(formValues, 'physical.createInventory')}
              isNonInteractive={isPostPendingOrder}
            />
          </Col>
        </IfFieldVisible>
      </Row>

      <Row>
        <Col
          xs={6}
          md={3}
        >
          <FieldsVolume disabled={isPostPendingOrder} />
        </Col>
      </Row>
    </>
  );
};

PhysicalForm.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  order: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  hiddenFields: PropTypes.object,
};

export default PhysicalForm;
