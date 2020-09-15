import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  Checkbox,
  Col,
  Row,
} from '@folio/stripes/components';

import {
  OngoingInfoNotes,
  RenewalDate,
  RenewalInterval,
  RenewalPeriod,
  ReviewDate,
} from '../../../common/POFields/OngoingInfoFields';

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
            <RenewalInterval value={interval} />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <RenewalDate value={renewalDate} />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <RenewalPeriod value={reviewPeriod} />
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
          <ReviewDate value={reviewDate} />
        </Col>
      )}
      <Col
        xs={6}
        lg={3}
      >
        <OngoingInfoNotes value={notes} />
      </Col>
    </Row>
  );
};

OngoingOrderInfoView.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OngoingOrderInfoView;
