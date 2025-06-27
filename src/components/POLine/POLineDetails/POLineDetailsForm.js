import get from 'lodash/get';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedTime,
  sourceLabels,
  FieldTags,
  IfFieldVisible,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../common/constants';
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
  FieldClaimingActive,
  FieldClaimingInterval,
  FieldBinderyActive,
  isBinderyActiveDisabled,
} from '../../../common/POLFields';
import getCreateInventorySetting from '../../../common/utils/getCreateInventorySetting';
import {
  isWorkflowStatusClosed,
  isWorkflowStatusIsPending,
  isWorkflowStatusOpen,
} from '../../PurchaseOrder/util';
import { toggleAutomaticExport } from '../../Utils/toggleAutomaticExport';
import {
  ConfirmReceivingWorkflowChangeModal,
  useReceivingWorkflowChange,
} from '../ConfirmReceivingWorkflowChange';

const isReceiptNotRequired = (status) => status === RECEIPT_STATUS.receiptNotRequired;

function POLineDetailsForm({
  change,
  formValues,
  initialValues: poLine,
  order,
  parentResources,
  vendor,
  hiddenFields = {},
  integrationConfigs = [],
}) {
  const createInventorySetting = getCreateInventorySetting(get(parentResources, ['createInventory', 'records'], []));
  const isManualOrder = Boolean(order?.manualPo);
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isClosedOrder = isWorkflowStatusClosed(order);
  const isOpenedOrder = isWorkflowStatusOpen(order);
  const isPackage = get(formValues, POL_FORM_FIELDS.isPackage);
  const isCheckInItems = get(formValues, POL_FORM_FIELDS.checkinItems);
  const isBinderyActive = get(formValues, POL_FORM_FIELDS.isBinderyActive, false);

  const isClaimingActive = Boolean(formValues?.claimingActive);
  const orderFormat = formValues?.orderFormat;

  const checkinItemsFieldDisabled = (
    isClosedOrder
    || isPackage
    || isBinderyActive
    || isReceiptNotRequired(formValues?.receiptStatus)
    || (isPostPendingOrder && Boolean(formValues?.checkinItems))
  );

  const {
    cancelReceivingWorkflowChange,
    confirmReceivingWorkflowChange,
    initReceivingWorkflowChange,
    isModalOpen: isReceivingWorkflowChangeModalOpen,
  } = useReceivingWorkflowChange();

  const onAcqMethodChange = useCallback(
    (value) => {
      change(POL_FORM_FIELDS.acquisitionMethod, value);
      const vendorAccount = formValues?.vendorDetail?.vendorAccount;

      toggleAutomaticExport({ vendorAccount, acquisitionMethod: value, integrationConfigs, change });
    }, [change, formValues, integrationConfigs],
  );

  const onReceiptStatusChange = useCallback(async ({ target: { value } }) => {
    const shouldTriggerReceivingWorkflowChange = (
      !isClosedOrder
      && !isCheckInItems
      && isReceiptNotRequired(value)
    );

    if (shouldTriggerReceivingWorkflowChange) {
      // Trigger the modal to confirm the change in receiving workflow (ConfirmReceivingWorkflowChangeModal)
      await (
        isOpenedOrder
          ? initReceivingWorkflowChange
          : Promise.resolve.bind(Promise)
      )()
        .then(() => {
          change(POL_FORM_FIELDS.receiptStatus, value || undefined);
          change(POL_FORM_FIELDS.checkinItems, true);
        })
        .catch(noop);
    } else {
      change(POL_FORM_FIELDS.receiptStatus, value || undefined);
    }
  }, [change, initReceivingWorkflowChange, isClosedOrder, isCheckInItems, isOpenedOrder]);

  const onClaimingActiveChange = useCallback((event) => {
    const { target: { checked } } = event;

    change(POL_FORM_FIELDS.claimingActive, checked);

    if (!checked) change(POL_FORM_FIELDS.claimingInterval, undefined);
  }, [change]);

  const onCheckInItemsChange = useCallback(async (value) => {
    if (isPostPendingOrder) {
      await initReceivingWorkflowChange()
        .then(() => { change(POL_FORM_FIELDS.checkinItems, value); })
        .catch(noop);
    } else {
      change(POL_FORM_FIELDS.checkinItems, value);
    }
  }, [change, initReceivingWorkflowChange, isPostPendingOrder]);

  return (
    <>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <FieldPOLineNumber poLineNumber={poLine.poLineNumber} />
        </Col>

        <IfFieldVisible
          visible={!hiddenFields.acquisitionMethod}
          name={POL_FORM_FIELDS.acquisitionMethod}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldAcquisitionMethod
              disabled={isPostPendingOrder}
              onChange={onAcqMethodChange}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.automaticExport}
          name={POL_FORM_FIELDS.automaticExport}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldAutomaticExport
              disabled={isPostPendingOrder || isManualOrder}
              isManualOrder={isManualOrder}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.orderFormat}
          name={POL_FORM_FIELDS.orderFormat}
        >
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

        <IfFieldVisible
          visible={!hiddenFields.receiptDate}
          name={POL_FORM_FIELDS.receiptDate}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldReceiptDate />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.receiptStatus}
          name={POL_FORM_FIELDS.receiptStatus}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldReceiptStatus
              workflowStatus={order.workflowStatus}
              onChange={onReceiptStatusChange}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.paymentStatus}
          name={POL_FORM_FIELDS.paymentStatus}
        >
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

        <IfFieldVisible
          visible={!hiddenFields.donor}
          name={POL_FORM_FIELDS.donor_DEPRECATED}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldDonor />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.selector}
          name={POL_FORM_FIELDS.selector}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldSelector disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.requester}
          name={POL_FORM_FIELDS.requester}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldRequester disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>
      </Row>

      <Row>
        <IfFieldVisible
          visible={!hiddenFields.claimingActive}
          name={POL_FORM_FIELDS.claimingActive}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldClaimingActive onChange={onClaimingActiveChange} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.claimingInterval}
          name={POL_FORM_FIELDS.claimingInterval}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldClaimingInterval
              disabled={!isClaimingActive}
              required={isClaimingActive}
            />
          </Col>
        </IfFieldVisible>
        <IfFieldVisible
          visible={!hiddenFields.details?.isBinderyActive}
          name={POL_FORM_FIELDS.isBinderyActive}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldBinderyActive disabled={isBinderyActiveDisabled(orderFormat)} />
          </Col>
        </IfFieldVisible>
      </Row>

      <Row>
        <IfFieldVisible
          visible={!hiddenFields.cancellationRestriction}
          name={POL_FORM_FIELDS.cancellationRestriction}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldCancellationRestriction />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.rush}
          name={POL_FORM_FIELDS.rush}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldRush disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.collection}
          name={POL_FORM_FIELDS.collection}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldCollection disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.checkinItems}
          name={POL_FORM_FIELDS.checkinItems}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldCheckInItems
              disabled={checkinItemsFieldDisabled}
              onChange={onCheckInItemsChange}
              required
            />
          </Col>
        </IfFieldVisible>
      </Row>
      <Row>
        <IfFieldVisible
          visible={!hiddenFields.cancellationRestrictionNote}
          name={POL_FORM_FIELDS.cancellationRestrictionNote}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldCancellationRestrictionNote />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.poLineDescription}
          name={POL_FORM_FIELDS.poLineDescription}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldPOLineDescription />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible
          visible={!hiddenFields.polTags}
          name={POL_FORM_FIELDS.tagsList}
        >
          <Col
            xs={6}
            md={3}
          >
            <FieldTags
              change={change}
              formValues={formValues}
              name={POL_FORM_FIELDS.tagsList}
            />
          </Col>
        </IfFieldVisible>
      </Row>

      <ConfirmReceivingWorkflowChangeModal
        isOpen={isReceivingWorkflowChangeModalOpen}
        onConfirm={confirmReceivingWorkflowChange}
        onCancel={cancelReceivingWorkflowChange}
      />
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
  integrationConfigs: PropTypes.arrayOf(PropTypes.object),
};

export default POLineDetailsForm;
