import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedTime,
  sourceLabels,
  FieldTags,
} from '@folio/stripes-acq-components';

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
} from '../../../common/POLFields';
import { IfFieldVisible } from '../../../common/IfFieldVisible';
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import getCreateInventorySetting from '../../../common/utils/getCreateInventorySetting';
import { getAcqMethodsOptions } from '../../../common/utils';

function POLineDetailsForm({
  change,
  formValues,
  initialValues: poLine,
  order,
  parentResources,
  vendor,
  hiddenFields = {},
}) {
  const createInventorySetting = getCreateInventorySetting(get(parentResources, ['createInventory', 'records'], []));
  const acquisitionMethods = getAcqMethodsOptions(get(parentResources, ['acquisitionMethods', 'records'], []));
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isPackage = get(formValues, 'isPackage');

  return (
    <>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <FieldPOLineNumber poLineNumber={poLine.poLineNumber} />
        </Col>

        <IfFieldVisible visible={!hiddenFields.acquisitionMethod} name="acquisitionMethod">
          <Col
            xs={6}
            md={3}
          >
            <FieldAcquisitionMethod
              acquisitionMethods={acquisitionMethods}
              disabled={isPostPendingOrder}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.orderFormat} name="orderFormat">
          <Col
            xs={6}
            md={3}
          >
            <FieldOrderFormat
              formValues={formValues}
              vendor={vendor}
              createInventorySetting={createInventorySetting}
              disabled={isPostPendingOrder}
            />
          </Col>
        </IfFieldVisible>

        <Col
          xs={6}
          md={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.createdOn" />}>
            <FolioFormattedTime dateString={get(poLine, 'metadata.createdDate')} />
          </KeyValue>
        </Col>

        <IfFieldVisible visible={!hiddenFields.receiptDate} name="receiptDate">
          <Col
            xs={6}
            md={3}
          >
            <FieldReceiptDate />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.receiptStatus} name="receiptStatus">
          <Col
            xs={6}
            md={3}
          >
            <FieldReceiptStatus workflowStatus={order.workflowStatus} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.paymentStatus} name="paymentStatus">
          <Col
            xs={6}
            md={3}
          >
            <FieldPaymentStatus workflowStatus={order.workflowStatus} />
          </Col>
        </IfFieldVisible>

        <Col
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.source" />}
            value={sourceLabels[poLine.source]}
          />
        </Col>

        <IfFieldVisible visible={!hiddenFields.donor} name="donor">
          <Col
            xs={6}
            md={3}
          >
            <FieldDonor disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.selector} name="selector">
          <Col
            xs={6}
            md={3}
          >
            <FieldSelector disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.requester} name="requester">
          <Col
            xs={6}
            md={3}
          >
            <FieldRequester disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>
      </Row>
      <Row>
        <IfFieldVisible visible={!hiddenFields.cancellationRestriction} name="cancellationRestriction">
          <Col
            xs={6}
            md={3}
          >
            <FieldCancellationRestriction />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.rush} name="rush">
          <Col
            xs={6}
            md={3}
          >
            <FieldRush disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.collection} name="collection">
          <Col
            xs={6}
            md={3}
          >
            <FieldCollection disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.checkinItems} name="checkinItems">
          <Col
            xs={6}
            md={3}
          >
            <FieldCheckInItems disabled={isPostPendingOrder || isPackage} required />
          </Col>
        </IfFieldVisible>
      </Row>
      <Row>
        <IfFieldVisible visible={!hiddenFields.cancellationRestrictionNote} name="cancellationRestrictionNote">
          <Col
            xs={6}
            md={3}
          >
            <FieldCancellationRestrictionNote />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.poLineDescription} name="poLineDescription">
          <Col
            xs={6}
            md={3}
          >
            <FieldPOLineDescription />
          </Col>
        </IfFieldVisible>

        <Col
          xs={6}
          md={3}
        >
          <FieldTags
            change={change}
            formValues={formValues}
            name="tags.tagList"
          />
        </Col>
      </Row>
    </>
  );
}

POLineDetailsForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  order: PropTypes.object,
  vendor: PropTypes.object,
  parentResources: PropTypes.shape({
    createInventory: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
  hiddenFields: PropTypes.object,
};

export default POLineDetailsForm;
