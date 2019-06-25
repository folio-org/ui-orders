import React, { Component, Fragment } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Col,
  IconButton,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

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
} from '../../../common/POFields';
import { required } from '../../Utils/Validate';
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
    stripes: PropTypes.object,
    dispatch: PropTypes.func,
    change: PropTypes.func,
    addresses: PropTypes.arrayOf(PropTypes.object),
    vendors: PropTypes.arrayOf(PropTypes.object),
    order: PropTypes.object,
  }

  onClearFieldUser = () => {
    const { dispatch, change } = this.props;

    dispatch(change('assignedToUser', ''));
    dispatch(change('assignedTo', null));
  }

  onAddUser = (user) => {
    const { dispatch, change } = this.props;

    dispatch(change('assignedToUser', `${user.personal.firstName} ${user.personal.lastName}`));
    dispatch(change('assignedTo', `${user.id}`));
  }

  userClearButton = () => {
    const { formValues } = this.props;
    const isValues = formValues.assignedTo || formValues.assignedToUser;

    if (isValues && isValues.length > 0) {
      return (
        <IconButton
          onClick={this.onClearFieldUser}
          icon="times-circle-solid"
          size="small"
        />
      );
    }

    return null;
  }

  userModal = () => {
    const columnMapping = {
      name: <FormattedMessage id="ui-orders.user.name" />,
      patronGroup: <FormattedMessage id="ui-orders.user.patronGroup" />,
      username: <FormattedMessage id="ui-orders.user.username" />,
      barcode: <FormattedMessage id="ui-orders.user.barcode" />,
    };
    const { stripes } = this.props;

    return (
      <Pluggable
        aria-haspopup="true"
        type="find-user"
        dataKey="user"
        searchLabel="+"
        searchButtonStyle="default"
        selectUser={this.onAddUser}
        visibleColumns={['name', 'patronGroup', 'username', 'barcode']}
        columnMapping={columnMapping}
        disableRecordCreation
        stripes={stripes}
      >
        <span>[no user-selection plugin]</span>
      </Pluggable>
    );
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
            className={css.pluginFieldWrapper}
          >
            <FieldVendor
              vendors={vendorOptions}
              name="vendor"
              required
              validate={required}
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
            className={css.pluginFieldWrapper}
          >
            <Field
              component={TextField}
              disabled
              endControl={this.userClearButton()}
              fullWidth
              hasClearIcon={false}
              label={<FormattedMessage id="ui-orders.orderDetails.assignedTo" />}
              name="assignedToUser"
            />
            <div className={css.pluginButtonWrapper}>
              {this.userModal()}
            </div>
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
