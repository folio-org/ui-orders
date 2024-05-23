import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
} from '@folio/stripes/components';
import { VisibilityControl } from '@folio/stripes-acq-components';

import {
  FieldPOLineNumber,
  FieldAcquisitionMethod,
  FieldAutomaticExport,
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
  FieldBinderyActive,
  isBinderyActiveDisabled,
} from '../../../../common/POLFields';

const POLineDetailsForm = ({ formValues, createInventorySetting }) => {
  const orderFormat = formValues?.orderFormat;
  const isBinderyActive = formValues?.details?.isBinderyActive;

  return (
    <>
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
          data-col-order-template-pol-auto-export
        >
          <VisibilityControl name="hiddenFields.automaticExport">
            <FieldAutomaticExport />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-pol-order-format
        >
          <FieldOrderFormat
            formValues={formValues}
            createInventorySetting={createInventorySetting}
            required={false}
          />
        </Col>
      </Row>

      <Row>
        <Col
          xs={3}
          data-col-order-template-pol-receipt-date
        >
          <VisibilityControl name="hiddenFields.receiptDate">
            <FieldReceiptDate />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-pol-receipt-status
        >
          <VisibilityControl name="hiddenFields.receiptStatus">
            <FieldReceiptStatus workflowStatus="template" />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-pol-payment-status
        >
          <VisibilityControl name="hiddenFields.paymentStatus">
            <FieldPaymentStatus workflowStatus="template" />
          </VisibilityControl>
        </Col>
      </Row>

      <Row>
        <Col
          xs={3}
          data-col-order-template-pol-donor
        >
          <VisibilityControl name="hiddenFields.donor">
            <FieldDonor />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-pol-selector
        >
          <VisibilityControl name="hiddenFields.selector">
            <FieldSelector />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-pol-requester
        >
          <VisibilityControl name="hiddenFields.requester">
            <FieldRequester />
          </VisibilityControl>
        </Col>
      </Row>

      <Row>
        <Col
          xs={3}
          data-col-order-template-pol-cancel-restriction
        >
          <VisibilityControl name="hiddenFields.cancellationRestriction">
            <FieldCancellationRestriction />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-pol-rush
        >
          <VisibilityControl name="hiddenFields.rush">
            <FieldRush />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-pol-collection
        >
          <VisibilityControl name="hiddenFields.collection">
            <FieldCollection />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-pol-check-in
        >
          <VisibilityControl name="hiddenFields.checkinItems">
            <FieldCheckInItems disabled={formValues.isPackage || isBinderyActive} />
          </VisibilityControl>
        </Col>
      </Row>

      <Row>
        <Col
          xs={3}
          data-col-order-template-pol-cancel-restr-note
        >
          <VisibilityControl name="hiddenFields.cancellationRestrictionNote">
            <FieldCancellationRestrictionNote />
          </VisibilityControl>
        </Col>

        <Col
          xs={3}
          data-col-order-template-pol-description
        >
          <VisibilityControl name="hiddenFields.poLineDescription">
            <FieldPOLineDescription />
          </VisibilityControl>
        </Col>
        <Col
          xs={3}
          data-col-order-template-pol-is-bindary-active
        >
          <VisibilityControl name="hiddenFields.details.isBinderyActive">
            <FieldBinderyActive disabled={isBinderyActiveDisabled(orderFormat)} />
          </VisibilityControl>
        </Col>
      </Row>
    </>
  );
};

POLineDetailsForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  createInventorySetting: PropTypes.object,
};

export default POLineDetailsForm;
