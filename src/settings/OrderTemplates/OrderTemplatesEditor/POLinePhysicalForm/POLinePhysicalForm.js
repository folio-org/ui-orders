import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';
import { VisibilityControl } from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../../common/constants';
import {
  FieldExpectedReceiptDate,
  FieldMaterialSupplier,
  FieldMaterialType,
  FieldReceiptDue,
  FieldsVolume,
} from '../../../../common/POLFields';
import InventoryRecordTypeSelectField from '../../../InventoryRecordTypeSelectField';

const POLinePhysicalForm = ({ materialTypes, change, formValues }) => {
  return (
    <>
      <Row>
        <Col
          xs={3}
          data-col-order-template-fresources-material-supplier
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
          data-col-order-template-fresources-receipt-due
        >
          <VisibilityControl name="hiddenFields.physical.receiptDue">
            <FieldReceiptDue />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-fresources-expected-receipt-date
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
              disabled={formValues?.details?.isBinderyActive}
            />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-fresources-material-type
        >
          <VisibilityControl name="hiddenFields.physical.materialType">
            <FieldMaterialType
              materialTypes={materialTypes}
              name={POL_FORM_FIELDS.physicalMaterialType}
            />
          </VisibilityControl>
        </Col>
      </Row>

      <Row start="xs">
        <Col
          xs={3}
          data-col-order-template-fresources-volumes
        >
          <FieldsVolume />
        </Col>
      </Row>
    </>
  );
};

POLinePhysicalForm.propTypes = {
  materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  formValues: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
};

export default POLinePhysicalForm;
