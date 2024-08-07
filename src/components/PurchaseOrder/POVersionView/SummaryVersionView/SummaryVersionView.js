import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
} from '@folio/stripes-acq-components';

import { DEFAULT_CLOSE_ORDER_REASONS } from '../../../../common/constants';
import {
  VersionCheckbox,
  VersionKeyValue,
} from '../../../../common/VersionView';

const getClosingReasonValue = (reason) => {
  if (!reason) return <NoValue />;

  return (
    <FormattedMessage
      id={`ui-orders.closeOrderModal.closingReasons.${DEFAULT_CLOSE_ORDER_REASONS[reason]}`}
      defaultMessage={reason}
    />
  );
};

export const SummaryVersionView = ({ version }) => {
  return (
    <>
      <Row start="xs">
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="totalItems"
            label={<FormattedMessage id="ui-orders.orderSummary.totalUnits" />}
            value={version?.totalItems}
          />
        </Col>

        <Col
          xs={6}
          lg={3}
        >
          <VersionCheckbox
            name="approved"
            checked={version?.approved}
            label={<FormattedMessage id="ui-orders.orderSummary.approved" />}
          />
        </Col>

        <Col
          data-test-workflow-status
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="workflowStatus"
            label={<FormattedMessage id="ui-orders.orderSummary.workflowStatus" />}
            value={ORDER_STATUS_LABEL[version?.workflowStatus]}
          />
        </Col>
      </Row>

      <Row>
        <Col
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="totalEstimatedPrice"
            label={<FormattedMessage id="ui-orders.orderSummary.totalEstimatedPrice" />}
            value={<AmountWithCurrencyField amount={version?.totalEstimatedPrice} />}
          />
        </Col>

        {version?.workflowStatus !== ORDER_STATUSES.pending && (
          <Col
            data-test-total-encumbered
            xs={6}
            lg={3}
          >
            <VersionKeyValue
              name="totalEncumbered"
              label={<FormattedMessage id="ui-orders.orderSummary.totalEncumbered" />}
              value={<AmountWithCurrencyField amount={version?.totalEncumbered} />}
            />
          </Col>
        )}

        <Col
          data-test-total-expended
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="totalExpended"
            label={<FormattedMessage id="ui-orders.orderSummary.totalExpended" />}
            value={<AmountWithCurrencyField amount={version?.totalExpended} />}
          />
        </Col>

        <Col
          data-test-total-credited
          xs={6}
          lg={3}
        >
          <VersionKeyValue
            name="totalCredited"
            label={<FormattedMessage id="ui-orders.orderSummary.totalCredited" />}
            value={<AmountWithCurrencyField amount={version?.totalCredited} />}
          />
        </Col>
      </Row>

      {(version.workflowStatus === ORDER_STATUSES.closed) && (
        <Row
          data-test-close-reason-block
          start="xs"
        >
          <Col xs={6}>
            <VersionKeyValue
              name="closeReason.reason"
              label={<FormattedMessage id="ui-orders.orderSummary.closingReason" />}
              value={getClosingReasonValue(version.closeReason?.reason)}
            />
          </Col>
          <Col xs={6}>
            <VersionKeyValue
              name="closeReason.note"
              label={<FormattedMessage id="ui-orders.orderSummary.closingNote" />}
              value={version.closeReason?.note}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

SummaryVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
