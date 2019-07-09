import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import { get } from 'lodash';

import {
  Checkbox,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import FolioFormattedDate from '../../FolioFormattedDate';
import FolioFormattedTime from '../../FolioFormattedTime';

const POLineDetails = ({ line }) => {
  const receiptDate = get(line, 'receiptDate');

  return (
    <Fragment>
      <Row start="xs">
        <Col
          data-col-line-details-number
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.number" />}
            value={get(line, 'poLineNumber')}
          />
        </Col>
        <Col
          data-col-line-details-acq-method
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.acquisitionMethod" />}
            value={get(line, 'acquisitionMethod')}
          />
        </Col>
        <Col
          data-col-line-details-order-format
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.orderFormat" />}
            value={get(line, 'orderFormat')}
          />
        </Col>
      </Row>
      <Row start="xs">
        <Col
          data-col-line-details-created-on
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.createdOn" />}>
            <FolioFormattedTime dateString={get(line, 'metadata.createdDate')} />
          </KeyValue>
        </Col>
        <Col
          data-col-line-details-receipt-date
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.receiptDate" />}>
            <FolioFormattedDate value={receiptDate} />
          </KeyValue>
        </Col>
        <Col
          data-col-line-details-source
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.source" />}
            value={get(line, 'source.code')}
          />
        </Col>
        <Col
          data-col-line-details-donor
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.donor" />}
            value={get(line, 'donor')}
          />
        </Col>
        <Col
          data-col-line-details-payment-status
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.paymentStatus" />}
            value={get(line, 'paymentStatus')}
          />
        </Col>
        <Col
          data-col-line-details-receipt-status
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.receiptStatus" />}
            value={get(line, 'receiptStatus')}
          />
        </Col>
        <Col
          data-col-line-details-selector
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.selector" />}
            value={get(line, 'selector')}
          />
        </Col>
        <Col
          data-col-line-details-requestor
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.requester" />}
            value={get(line, 'requester')}
          />
        </Col>
        <Col
          data-col-line-details-cancellation-restriction
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.cancellationRestriction" />}>
            <Checkbox checked={get(line, 'cancellationRestriction')} disabled />
          </KeyValue>
        </Col>
        <Col
          data-col-line-details-rush
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.rush" />}>
            <Checkbox checked={get(line, 'rush')} disabled />
          </KeyValue>
        </Col>
        <Col
          data-col-line-details-collection
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.сollection" />}>
            <Checkbox checked={get(line, 'collection')} disabled />
          </KeyValue>
        </Col>
        <Col
          data-col-line-details-checkin-items
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.checkinItems" />}>
            <Checkbox checked={get(line, 'checkinItems')} disabled />
          </KeyValue>
        </Col>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.cancellationRestrictionNote" />}
            value={get(line, 'cancellationRestrictionNote')}
          />
        </Col>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.poLineDescription" />}
            value={get(line, 'poLineDescription')}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

POLineDetails.propTypes = {
  line: PropTypes.object,
};

POLineDetails.defaultProps = {
  line: {},
};

export default POLineDetails;
