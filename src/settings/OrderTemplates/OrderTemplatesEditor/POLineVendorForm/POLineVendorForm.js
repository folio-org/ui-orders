import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import {
  VendorReferenceNumbersFields,
  VisibilityControl,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../../common/constants';
import {
  FieldVendorAccountNumber,
  FieldVendorInstructions,
} from '../../../../common/POLFields';

const defaultValues = {
  accounts: [],
};

const POLineVendorForm = ({ accounts = defaultValues.accounts }) => {
  return (
    <Row>
      <Col
        xs={12}
        data-col-order-template-vendor-number
      >
        <VendorReferenceNumbersFields
          fieldName={POL_FORM_FIELDS.vendorDetailReferenceNumbers}
          withValidation={false}
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-vendor-account
      >
        <VisibilityControl name="hiddenFields.vendorDetail.vendorAccount">
          <FieldVendorAccountNumber accounts={accounts} />
        </VisibilityControl>
      </Col>

      <Col
        xs={3}
        data-col-order-template-vendor-instruction
      >
        <VisibilityControl name="hiddenFields.vendorDetail.instructions">
          <FieldVendorInstructions />
        </VisibilityControl>
      </Col>
    </Row>
  );
};

POLineVendorForm.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
};

export default POLineVendorForm;
