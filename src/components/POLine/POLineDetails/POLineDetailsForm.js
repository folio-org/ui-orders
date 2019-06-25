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
import { isWorkflowStatusOpen } from '../../PurchaseOrder/util';
import getCreateInventorySetting from '../../../common/utils/getCreateInventorySetting';
import FolioFormattedTime from '../../FolioFormattedTime';

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
    const isOpenedOrder = isWorkflowStatusOpen(order);

    return (
      <Fragment>
        <Row>
          <Col xs={6}>
            {poLine.id && <FieldPOLineNumber />}
          </Col>
          <Col xs={6}>
            <FieldAcquisitionMethod disabled={isOpenedOrder} />
          </Col>
          <Col xs={6}>
            <FieldOrderFormat
              change={change}
              dispatch={dispatch}
              formValues={formValues}
              vendors={vendors}
              orderVendorId={order.vendor}
              createInventorySetting={createInventorySetting}
              disabled={isOpenedOrder}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue label={<FormattedMessage id="ui-orders.poLine.createdOn" />}>
              <FolioFormattedTime dateString={get(poLine, 'metadata.createdDate')} />
            </KeyValue>
          </Col>
          <Col xs={6}>
            <FieldReceiptDate />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.source" />}
              value={get(poLine, 'source.code')}
            />
          </Col>
          <Col xs={6}>
            <FieldDonor disabled={isOpenedOrder} />
          </Col>
          <Col xs={6}>
            <FieldPaymentStatus workflowStatus={order.workflowStatus} />
          </Col>
          <Col xs={6}>
            <FieldReceiptStatus workflowStatus={order.workflowStatus} />
          </Col>
          <Col xs={6}>
            <FieldSelector disabled={isOpenedOrder} />
          </Col>
          <Col xs={6}>
            <FieldRequester disabled={isOpenedOrder} />
          </Col>
          <Col xs={3}>
            <FieldCancellationRestriction />
          </Col>
          <Col xs={3}>
            <FieldRush disabled={isOpenedOrder} />
          </Col>
          <Col xs={3}>
            <FieldCollection disabled={isOpenedOrder} />
          </Col>
          <Col xs={3}>
            <FieldCheckInItems disabled={isOpenedOrder} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FieldCancellationRestrictionNote />
          </Col>
          <Col xs={12}>
            <FieldPOLineDescription />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default POLineDetailsForm;
