import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { get } from 'lodash';

import {
  Checkbox,
  Col,
  KeyValue,
  MetaSection,
  Row,
} from '@folio/stripes/components';

import FolioFormattedTime from '../../FolioFormattedTime';

import css from './PODetailsView.css';

class PODetailsView extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    addresses: PropTypes.arrayOf(PropTypes.object),
  };

  render() {
    const { order, addresses } = this.props;
    const addressBillTo = get(addresses.find(el => el.id === get(order, 'billTo', '')), 'address', '');
    const addressShipTo = get(addresses.find(el => el.id === get(order, 'shipTo', '')), 'address', '');

    const metadata = get(order, 'metadata');

    return (
      <Fragment>
        <Row>
          <Col xs={12}>
            <MetaSection
              id="polItemMeta"
              lastUpdatedBy={get(metadata, 'updatedByUserId')}
              lastUpdatedDate={get(metadata, 'updatedDate')}
              createdBy={get(metadata, 'createdByUserId')}
              createdDate={get(metadata, 'createdDate')}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.vendor" />}
              value={get(order, 'vendorName')}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.createdBy" />}
              value={get(order, 'createdByName')}
            />
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}
              value={get(order, 'poNumber')}
            />
          </Col>
          <Col xs={6}>
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.createdOn" />}>
              <FolioFormattedTime dateString={get(order, 'metadata.createdDate')} />
            </KeyValue>
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.assignedTo" />}
              value={get(order, 'assignedToUser')}
            />
          </Col>
          <Col
            className={css.addressWrapper}
            data-test-order-details-bill-to
            xs={6}
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
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.shipTo" />}
              value={addressShipTo}
            />
          </Col>
          <Col xs={6}>
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.manualPO" />}>
              <Checkbox checked={get(order, 'manualPo')} disabled />
            </KeyValue>
          </Col>
          <Col xs={6}>
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.re_encumber" />}>
              <Checkbox checked={get(order, 'reEncumber')} disabled />
            </KeyValue>
          </Col>
          <Col xs={6}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.orderType" />}
              value={get(order, 'orderType')}
            />
          </Col>
          <Col
            data-test-order-details-owner
            xs={6}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.poLine.owner" />}
              value={get(order, 'owner')}
            />
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
