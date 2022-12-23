import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

import {
  VersionCheckbox,
  VersionKeyValue,
} from '../../../../common/VersionView';

export const OngoingInfoVersionView = ({ version }) => {
  const data = version?.ongoing;

  return (
    <>
      <Row start="xs">
        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name="ongoing.isSubscription"
            checked={data?.isSubscription}
            label={<FormattedMessage id="ui-orders.renewals.subscription" />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="ongoing.interval"
            label={<FormattedMessage id="ui-orders.renewals.renewalInterval" />}
            value={data?.interval}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="ongoing.renewalDate"
            label={<FormattedMessage id="ui-orders.renewals.renewalDate" />}
            value={<FolioFormattedDate value={data?.renewalDate} />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="ongoing.reviewPeriod"
            label={<FormattedMessage id="ui-orders.renewals.reviewPeriod" />}
            value={<FolioFormattedDate value={data?.reviewPeriod} />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name="ongoing.manualRenewal"
            checked={data?.manualRenewal}
            label={<FormattedMessage id="ui-orders.renewals.manualRenewal" />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="ongoing.reviewDate"
            label={<FormattedMessage id="ui-orders.renewals.reviewDate" />}
            value={<FolioFormattedDate value={data?.reviewDate} />}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="ongoing.notes"
            label={<FormattedMessage id="ui-orders.renewals.notes" />}
            value={data?.notes}
          />
        </Col>
      </Row>
    </>
  );
};

OngoingInfoVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
