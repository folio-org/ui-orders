import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  FieldDatepickerFinal,
} from '@folio/stripes-acq-components';

import {
  FieldMaterialType,
  FieldMaterialSupplier,
} from '../../../common/POLFields';
import { IfFieldVisible } from '../../../common/IfFieldVisible';
import {
  isWorkflowStatusClosed,
  isWorkflowStatusIsPending,
} from '../../PurchaseOrder/util';
import InventoryRecordTypeSelectField from '../../../settings/InventoryRecordTypeSelectField';
import { isMaterialTypeRequired } from '../../Utils/Validate';

const OtherForm = ({ order, materialTypes, formValues, change, hiddenFields = {} }) => {
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isClosedOrder = isWorkflowStatusClosed(order);

  return (
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
          <FieldDatepickerFinal
            label={<FormattedMessage id="ui-orders.physical.receiptDue" />}
            name="physical.receiptDue"
          />
        </Col>
      </IfFieldVisible>

      <IfFieldVisible visible={!hiddenFields.physical?.expectedReceiptDate} name="physical.expectedReceiptDate">
        <Col
          xs={6}
          md={3}
        >
          <FieldDatepickerFinal
            label={<FormattedMessage id="ui-orders.physical.expectedReceiptDate" />}
            name="physical.expectedReceiptDate"
          />
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
  );
};

OtherForm.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  order: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  hiddenFields: PropTypes.object,
};

export default OtherForm;
