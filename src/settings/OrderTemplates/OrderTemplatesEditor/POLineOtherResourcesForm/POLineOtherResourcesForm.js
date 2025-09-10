import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { VisibilityControl } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../../common/constants';
import {
  FieldExpectedReceiptDate,
  FieldMaterialSupplier,
  FieldMaterialType,
  FieldReceiptDue,
} from '../../../../common/POLFields';
import InventoryRecordTypeSelectField from '../../../InventoryRecordTypeSelectField';

const POLineOtherResourcesForm = ({
  change,
  formValues,
  materialTypes,
}) => {
  return (
    <>
      <Row>
        <Col
          xs={3}
          data-col-order-template-other-resources-material-supplier
        >
          <VisibilityControl name="hiddenFields.physical.materialSupplier">
            <FieldMaterialSupplier
              materialSupplierId={formValues?.physical?.materialSupplier}
              change={change}
            />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-other-resources-receipt-due
        >
          <VisibilityControl name="hiddenFields.physical.receiptDue">
            <FieldReceiptDue />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-other-resources-expected-receipt-date
        >
          <VisibilityControl name="hiddenFields.physical.expectedReceiptDate">
            <FieldExpectedReceiptDate />
          </VisibilityControl>
        </Col>

        <Col xs={3}>
          <VisibilityControl name="hiddenFields.physical.createInventory">
            <InventoryRecordTypeSelectField
              label="ui-orders.physical.createInventory"
              name={POL_FORM_FIELDS.physicalCreateInventory}
            />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-other-resources-material-type
        >
          <VisibilityControl name="hiddenFields.physical.materialType">
            <FieldMaterialType
              materialTypes={materialTypes}
              name={POL_FORM_FIELDS.physicalMaterialType}
            />
          </VisibilityControl>
        </Col>
      </Row>
    </>
  );
};

POLineOtherResourcesForm.propTypes = {
  change: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default POLineOtherResourcesForm;
