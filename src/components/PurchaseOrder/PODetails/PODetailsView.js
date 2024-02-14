import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Checkbox,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  ClipCopy,
  ViewMetaData,
} from '@folio/stripes/smart-components';
import {
  AcqUnitsView,
  FolioFormattedTime,
  IfVisible,
  OrganizationValue,
} from '@folio/stripes-acq-components';

import { isWorkflowStatusOpen } from '../util';
import UserValue from './UserValue';

import css from './PODetailsView.css';

class PODetailsView extends Component {
  static propTypes = {
    order: PropTypes.object.isRequired,
    addresses: PropTypes.arrayOf(PropTypes.object),
    hiddenFields: PropTypes.object,
  };

  static defaultProps = {
    addresses: [],
    hiddenFields: {},
  }

  render() {
    const { order, addresses, hiddenFields } = this.props;
    const addressBillTo = get(addresses.find(el => el.id === get(order, 'billTo', '')), 'address', '');
    const addressShipTo = get(addresses.find(el => el.id === get(order, 'shipTo', '')), 'address', '');

    const metadata = get(order, 'metadata');

    return (
      <>
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
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}>
              {order?.poNumber
                ? (
                  <>
                    {order.poNumber}
                    <ClipCopy text={order.poNumber} />
                  </>
                )
                : <NoValue />
              }
            </KeyValue>
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <OrganizationValue
              id={order.vendor}
              label={<FormattedMessage id="ui-orders.orderDetails.vendor" />}
            />
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

          <IfVisible visible={!hiddenFields.acqUnitIds}>
            <Col
              xs={6}
              lg={3}
            >
              <AcqUnitsView units={order.acqUnitIds} />
            </Col>
          </IfVisible>

          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.approvalDate" />}>
              <FolioFormattedTime dateString={order?.approvalDate} />
            </KeyValue>
          </Col>

          <IfVisible visible={!hiddenFields.assignedTo}>
            <Col
              xs={6}
              lg={3}
            >
              <KeyValue
                label={<FormattedMessage id="ui-orders.orderDetails.assignedTo" />}
              >
                <UserValue userId={order.assignedTo} />
              </KeyValue>
            </Col>
          </IfVisible>

          <IfVisible visible={!hiddenFields.billTo}>
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
          </IfVisible>

          <IfVisible visible={!hiddenFields.shipTo}>
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
          </IfVisible>

          <IfVisible visible={!hiddenFields.manualPo}>
            <Col
              xs={6}
              lg={3}
            >
              <Checkbox
                checked={get(order, 'manualPo')}
                disabled
                label={<FormattedMessage id="ui-orders.orderDetails.manualPO" />}
                vertical
              />
            </Col>
          </IfVisible>

          <IfVisible visible={!hiddenFields.reEncumber}>
            <Col
              xs={6}
              lg={3}
            >
              <Checkbox
                checked={get(order, 'reEncumber')}
                disabled
                label={<FormattedMessage id="ui-orders.orderDetails.reEncumber" />}
                vertical
              />
            </Col>
          </IfVisible>

          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.createdBy" />}
            >
              <UserValue userId={get(order, 'metadata.createdByUserId')} />
            </KeyValue>
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.createdOn" />}>
              <FolioFormattedTime dateString={get(order, 'metadata.createdDate')} />
            </KeyValue>
          </Col>
          {isWorkflowStatusOpen(order) && (
            <Col
              xs={6}
              lg={3}
            >
              <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.dateOpened" />}>
                <FolioFormattedTime dateString={order?.dateOrdered} />
              </KeyValue>
            </Col>
          )}
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
      </>
    );
  }
}

export default PODetailsView;
