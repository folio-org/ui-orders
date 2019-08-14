import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import {
  Checkbox,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { AcqUnitsView } from '@folio/stripes-acq-components';

import FolioFormattedTime from '../../FolioFormattedTime';

import css from './PODetailsView.css';

class PODetailsView extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    addresses: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    addresses: [],
  }

  render() {
    const { order, addresses } = this.props;
    const addressBillTo = get(addresses.find(el => el.id === get(order, 'billTo', '')), 'address', '');
    const addressShipTo = get(addresses.find(el => el.id === get(order, 'shipTo', '')), 'address', '');

    const metadata = get(order, 'metadata');

    return (
      <Fragment>
        <Row>
          <Col xs={12}>
            {metadata && <ViewMetaData metadata={metadata} />}
          </Col>
        </Row>
        <Row start="xs">
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.vendor" />}
              value={get(order, 'vendorName')}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.createdBy" />}
              value={get(order, 'createdByName')}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}
              value={get(order, 'poNumber')}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.createdOn" />}>
              <FolioFormattedTime dateString={get(order, 'metadata.createdDate')} />
            </KeyValue>
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.approvalDate" />}>
              <FolioFormattedTime dateString={get(order, 'approvalDate')} />
            </KeyValue>
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.assignedTo" />}
              value={get(order, 'assignedToUser')}
            />
          </Col>
          <Col
            className={css.addressWrapper}
            data-test-order-details-bill-to
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.billTo" />}
              value={addressBillTo}
            />
          </Col>
          <Col
            className={css.addressWrapper}
            data-test-order-details-ship-to
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.shipTo" />}
              value={addressShipTo}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.manualPO" />}>
              <Checkbox checked={get(order, 'manualPo')} disabled />
            </KeyValue>
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.reEncumber" />}>
              <Checkbox checked={get(order, 'reEncumber')} disabled />
            </KeyValue>
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.orderType" />}
              value={get(order, 'orderType')}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <AcqUnitsView units={order.acqUnitIds} />
          </Col>
          <Col xs={12}>
            {get(order, 'notes', []).map((note, index) => (
              <KeyValue
                key={index}
                label={<FormattedMessage id="ui-orders.orderDetails.note" />}
                value={note}
              />
            ))}
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default PODetailsView;
