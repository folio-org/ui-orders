import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Checkbox,
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

const OngoingOrderInfoView = ({ order: { ongoing = {} } }) => {
  const {
    interval,
    renewalDate,
    reviewPeriod,
    manualRenewal,
    isSubscription,
    notes,
    reviewDate,
  } = ongoing;

  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <Checkbox
          checked={isSubscription}
          disabled
          label={<FormattedMessage id="ui-orders.renewals.subscription" />}
          vertical
        />
      </Col>
      {isSubscription ? (
        <>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.renewals.renewalInterval" />}
              value={interval}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.renewals.renewalDate" />}>
              <FolioFormattedDate value={renewalDate} />
            </KeyValue>
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.renewals.reviewPeriod" />}
              value={reviewPeriod}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <Checkbox
              checked={manualRenewal}
              disabled
              label={<FormattedMessage id="ui-orders.renewals.manualRenewal" />}
              vertical
            />
          </Col>
        </>
      ) : (
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.renewals.reviewDate" />}>
            <FolioFormattedDate value={reviewDate} />
          </KeyValue>
        </Col>
      )}
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-orders.renewals.notes" />}
          value={notes}
        />
      </Col>
    </Row>
  );
};

OngoingOrderInfoView.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OngoingOrderInfoView;
