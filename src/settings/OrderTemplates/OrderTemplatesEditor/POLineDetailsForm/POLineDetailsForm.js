import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';

import {
  FieldPOLineNumber,
  FieldAcquisitionMethod,
  FieldOrderFormat,
  FieldReceiptDate,
  FieldDonor,
  FieldPaymentStatus,
  FieldReceiptStatus,
  FieldSelector,
  FieldCancellationRestriction,
  FieldRush,
  FieldCollection,
  FieldCheckInItems,
  FieldRequester,
  FieldCancellationRestrictionNote,
  FieldPOLineDescription,
} from '../../../../common/POLFields';

const POLineDetailsForm = ({ change, dispatch, formValues, createInventorySetting }) => {
  return (
    <Row>
      <Col
        xs={3}
        data-col-order-template-pol-number
      >
        <FieldPOLineNumber />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-acq-method
      >
        <FieldAcquisitionMethod required={false} />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-order-format
      >
        <FieldOrderFormat
          change={change}
          dispatch={dispatch}
          formValues={formValues}
          createInventorySetting={createInventorySetting}
          required={false}
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-receipt-date
      >
        <FieldReceiptDate />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-donor
      >
        <FieldDonor />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-payment-status
      >
        <FieldPaymentStatus workflowStatus="template" />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-receipt-status
      >
        <FieldReceiptStatus workflowStatus="template" />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-selector
      >
        <FieldSelector />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-cancel-restriction
      >
        <FieldCancellationRestriction />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-rush
      >
        <FieldRush />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-collection
      >
        <FieldCollection />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-check-in
      >
        <FieldCheckInItems
          disabled={formValues.isPackage}
          isPackage={formValues.isPackage}
        />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-requester
      >
        <FieldRequester />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-cancel-restr-note
      >
        <FieldCancellationRestrictionNote />
      </Col>

      <Col
        xs={3}
        data-col-order-template-pol-description
      >
        <FieldPOLineDescription />
      </Col>
    </Row>
  );
};

POLineDetailsForm.propTypes = {
  change: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  createInventorySetting: PropTypes.object,
};

export default POLineDetailsForm;
