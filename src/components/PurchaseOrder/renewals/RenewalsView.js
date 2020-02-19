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

const RenewalsView = ({ order: { renewal = {} } }) => {
  const {
    interval,
    renewalDate,
    reviewPeriod,
    manualRenewal,
    isSubscription,
    notes,
    reviewDate,
  } = renewal;

  return (
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue label={<FormattedMessage id="ui-orders.renewals.subscription" />}>
          <Checkbox
            checked={isSubscription}
            disabled
          />
        </KeyValue>
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
            <KeyValue label={<FormattedMessage id="ui-orders.renewals.manualRenewal" />}>
              <Checkbox
                checked={manualRenewal}
                disabled
              />
            </KeyValue>
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

RenewalsView.propTypes = {
  order: PropTypes.object.isRequired,
};

export default RenewalsView;
