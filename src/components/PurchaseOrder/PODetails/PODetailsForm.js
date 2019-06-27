import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Col,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';

import { getAddressOptions, getVendorOptions } from '../../../common/utils';
import {
  FieldPrefix,
  FieldSuffix,
  FieldBillTo,
  FieldShipTo,
  FieldIsManualPO,
  FieldIsReEncumber,
  FieldsNotes,
  FieldVendor,
  FieldAssignedTo,
} from '../../../common/POFields';
import FolioFormattedTime from '../../FolioFormattedTime';
import FieldOrderType from './FieldOrderType';
import { isWorkflowStatusOpen } from '../util';

import css from './PODetailsForm.css';

class PODetailsForm extends Component {
  static propTypes = {
    generatedNumber: PropTypes.string,
    orderNumberSetting: PropTypes.object.isRequired,
    prefixesSetting: PropTypes.object.isRequired,
    suffixesSetting: PropTypes.object.isRequired,
    formValues: PropTypes.object,
    dispatch: PropTypes.func,
    change: PropTypes.func,
    addresses: PropTypes.arrayOf(PropTypes.object),
    vendors: PropTypes.arrayOf(PropTypes.object),
    order: PropTypes.object,
  }

  fillBackGeneratedNumber = (e, value) => {
    const { change, dispatch, generatedNumber } = this.props;

    if (value === '') {
      // setTimeout is required due to async nature of redux-form CHANGE field value event.
      window.setTimeout(() => dispatch(change('poNumber', generatedNumber)));
    }
  }

  render() {
    const {
      addresses,
      formValues,
      orderNumberSetting: { canUserEditOrderNumber },
      prefixesSetting,
      suffixesSetting,
      order,
      vendors,
      dispatch,
      change,
    } = this.props;

    const isOpenedOrder = isWorkflowStatusOpen(order);
    const vendorOptions = getVendorOptions(vendors);
    const addressesOptions = getAddressOptions(addresses);
    const addressBillTo = get(addresses.find(el => el.id === formValues.billTo), 'address', '');
    const addressShipTo = get(addresses.find(el => el.id === formValues.shipTo), 'address', '');

    return (
      <Fragment>
        <Row>
          <Col xs={4}>
            <FieldPrefix
              disabled={isOpenedOrder}
              prefixes={prefixesSetting.selectedItems}
            />
          </Col>
          <Col xs={4}>
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}
              name="poNumber"
              disabled={!canUserEditOrderNumber || isOpenedOrder}
              onBlur={this.fillBackGeneratedNumber}
            />
          </Col>
          <Col xs={4}>
            <FieldSuffix
              disabled={isOpenedOrder}
              suffixes={suffixesSetting.selectedItems}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            lg={3}
          >
            <FieldVendor
              vendors={vendorOptions}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.orderDetails.createdBy" />}
              name="createdByName"
              disabled
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.createdOn" />}>
              <FolioFormattedTime dateString={get(formValues, 'metadata.createdDate')} />
            </KeyValue>
          </Col>
          <Col
            xs={12}
            lg={3}
          >
            <FieldAssignedTo
              dispatch={dispatch}
              change={change}
              assignedToValue={formValues.assignedTo || formValues.assignedToUser}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={6}
            lg={3}
          >
            <FieldIsManualPO disabled={isOpenedOrder} />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <FieldIsReEncumber disabled={isOpenedOrder} />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <FieldOrderType disabled={isOpenedOrder} />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <FieldBillTo
              addresses={addressesOptions}
              disabled={isOpenedOrder}
            />
          </Col>
          <Col
            className={css.addressWrapper}
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.address" />}
              value={addressBillTo}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <FieldShipTo addresses={addressesOptions} />
          </Col>
          <Col
            className={css.addressWrapper}
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.address" />}
              value={addressShipTo}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FieldsNotes />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default PODetailsForm;
