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
import { IfVisible } from '@folio/stripes-acq-components';

import {
  OngoingInfoNotes,
  RenewalDate,
  RenewalInterval,
  RenewalPeriod,
  ReviewDate,
} from '../../../common/POFields/OngoingInfoFields';

const OngoingOrderInfoView = ({ order: { ongoing = {} }, hiddenFields = {} }) => {
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
      <IfVisible visible={!hiddenFields.ongoing?.isSubscription}>
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
      </IfVisible>

      {isSubscription ? (
        <>
          <IfVisible visible={!hiddenFields.ongoing?.interval}>
            <Col
              xs={6}
              lg={3}
            >
              <RenewalInterval value={interval} />
            </Col>
          </IfVisible>

          <IfVisible visible={!hiddenFields.ongoing?.renewalDate}>
            <Col
              xs={6}
              lg={3}
            >
              <RenewalDate value={renewalDate} />
            </Col>
          </IfVisible>

          <IfVisible visible={!hiddenFields.ongoing?.reviewPeriod}>
            <Col
              xs={6}
              lg={3}
            >
              <RenewalPeriod value={reviewPeriod} />
            </Col>
          </IfVisible>

          <IfVisible visible={!hiddenFields.ongoing?.manualRenewal}>
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
          </IfVisible>
        </>
      ) : (
        <IfVisible visible={!hiddenFields.ongoing?.reviewDate}>
          <Col
            xs={6}
            lg={3}
          >
            <ReviewDate value={reviewDate} />
          </Col>
        </IfVisible>
      )}

      <IfVisible visible={!hiddenFields.ongoing?.notes}>
        <Col
          xs={6}
          lg={3}
        >
          <OngoingInfoNotes value={notes} />
        </Col>
      </IfVisible>
    </Row>
  );
};

OngoingOrderInfoView.propTypes = {
  order: PropTypes.object.isRequired,
  hiddenFields: PropTypes.object,
};

export default OngoingOrderInfoView;
