import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import {
  FieldsNotes,
} from '../../../../common/POFields';

const PurchaseOrderNotesForm = ({ required }) => {
  return (
    <Row start="xs">
      <Col xs={12}>
        <FieldsNotes required={required} />
      </Col>
    </Row>
  );
};

PurchaseOrderNotesForm.propTypes = {
  required: PropTypes.bool,
};

export default PurchaseOrderNotesForm;
