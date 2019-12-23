import React, { Component, Fragment } from 'react';
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
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import getCreateInventorySetting from '../../../common/utils/getCreateInventorySetting';

class POLineDetailsForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    change: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    formValues: PropTypes.object.isRequired,
    order: PropTypes.object,
    parentResources: PropTypes.shape({
      vendors: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object).isRequired,
      }).isRequired,
      createInventory: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object).isRequired,
      }).isRequired,
    }).isRequired,
  };

  render() {
    const { change, dispatch, formValues, initialValues: poLine, parentResources, order } = this.props;
    const vendors = get(parentResources, 'vendors.records', []);
    const createInventorySetting = getCreateInventorySetting(get(parentResources, ['createInventory', 'records'], []));
    const isPostPendingOrder = !isWorkflowStatusIsPending(order);
    const isPackage = get(formValues, 'isPackage');

    return (
      <Fragment>
        <Row>
          <Col
            xs={6}
            md={3}
          >
            {poLine.id && <FieldPOLineNumber />}
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldAcquisitionMethod disabled={isPostPendingOrder} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldOrderFormat
              change={change}
              dispatch={dispatch}
              formValues={formValues}
              vendors={vendors}
              orderVendorId={order.vendor}
              createInventorySetting={createInventorySetting}
              disabled={isPostPendingOrder}
            />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.poLine.createdOn" />}>
              <FolioFormattedTime dateString={get(poLine, 'metadata.createdDate')} />
            </KeyValue>
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldReceiptDate />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.source" />}
              value={sourceLabels[poLine.source]}
            />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldDonor disabled={isPostPendingOrder} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldPaymentStatus workflowStatus={order.workflowStatus} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldReceiptStatus workflowStatus={order.workflowStatus} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldSelector disabled={isPostPendingOrder} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldRequester disabled={isPostPendingOrder} />
          </Col>
        </Row>
        <Row>
          <Col
            xs={6}
            md={3}
          >
            <FieldCancellationRestriction />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldRush disabled={isPostPendingOrder} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldCollection disabled={isPostPendingOrder} />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldCheckInItems disabled={isPostPendingOrder || isPackage} />
          </Col>
        </Row>
        <Row>
          <Col
            xs={6}
            md={3}
          >
            <FieldCancellationRestrictionNote />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldPOLineDescription />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldTags
              formName="POLineForm"
              name="tags.tagList"
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default POLineDetailsForm;
