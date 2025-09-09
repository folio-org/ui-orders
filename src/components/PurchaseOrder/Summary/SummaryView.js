import PropTypes from 'prop-types';
import { useMemo } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  Checkbox,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  IfVisible,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import { FiscalYearSelect } from '../../FiscalYearSelect';
import TotalEncumberedValue from './TotalEncumberedValue';
import TotalExpendedValue from './TotalExpendedValue';
import TotalUnits from './TotalUnits';
import WorkflowStatus from './WorkflowStatus';

const defaultProps = {
  fiscalYearsGrouped: {
    current: [],
    previous: [],
  },
  hiddenFields: {},
  order: {},
};

const SummaryView = ({
  fiscalYearsGrouped = defaultProps.fiscalYearsGrouped,
  hiddenFields = defaultProps.hiddenFields,
  onSelectFiscalYear,
  order = defaultProps.order,
  selectedFiscalYear,
}) => {
  const intl = useIntl();

  const fiscalYearsOptions = useMemo(() => {
    const {
      current: currentFiscalYears,
      previous: previousFiscalYears,
    } = fiscalYearsGrouped;

    return [
      currentFiscalYears?.length && (
        <optgroup
          key="current-fiscal-year"
          label={intl.formatMessage({ id: 'ui-orders.order.fiscalYear.current' })}
        >
          {currentFiscalYears.map((year) => (
            <option
              key={year.id}
              value={year.id}
            >
              {year.code}
            </option>
          ))}
        </optgroup>
      ),
      previousFiscalYears?.length && (
        <optgroup
          key="previous-fiscal-years"
          label={intl.formatMessage({ id: 'ui-orders.order.fiscalYear.previous' })}
        >
          {previousFiscalYears.map((year) => (
            <option
              key={year.id}
              value={year.id}
            >
              {year.code}
            </option>
          ))}
        </optgroup>
      ),
    ].filter(Boolean);
  }, [fiscalYearsGrouped, intl]);

  return (
    <>
      <Row start="xs">
        {Boolean(fiscalYearsOptions.length) && (
          <Col
            xs={6}
            lg={3}
          >
            <FiscalYearSelect
              dataOptions={fiscalYearsOptions}
              onSelect={onSelectFiscalYear}
              value={selectedFiscalYear}
            />
          </Col>
        )}

        <Col
          xs={6}
          lg={3}
        >
          <TotalUnits value={order.totalItems} />
        </Col>

        <IfVisible visible={!hiddenFields.approved}>
          <Col
            xs={6}
            lg={3}
          >
            <Checkbox
              checked={order.approved}
              disabled
              label={<FormattedMessage id="ui-orders.orderSummary.approved" />}
              type="checkbox"
              vertical
            />
          </Col>
        </IfVisible>

        <Col
          data-test-workflow-status
          xs={6}
          lg={3}
        >
          <WorkflowStatus value={order.workflowStatus} />
        </Col>
      </Row>

      <Row>
        <Col
          xs={6}
          lg={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.orderSummary.totalEstimatedPrice" />}>
            <AmountWithCurrencyField amount={order.totalEstimatedPrice} />
          </KeyValue>
        </Col>
        {order.workflowStatus !== ORDER_STATUSES.pending && (
          <Col
            data-test-total-encumbered
            xs={6}
            lg={3}
          >
            <TotalEncumberedValue
              totalEncumbered={order.totalEncumbered}
              label={<FormattedMessage id="ui-orders.orderSummary.totalEncumbered" />}
            />
          </Col>
        )}
        <Col
          data-test-total-expended
          xs={6}
          lg={3}
        >
          <TotalExpendedValue
            totalExpended={order.totalExpended}
            label={<FormattedMessage id="ui-orders.orderSummary.totalExpended" />}
          />
        </Col>

        <Col
          data-test-total-credited
          xs={6}
          lg={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.orderSummary.totalCredited" />}
            value={<AmountWithCurrencyField amount={order?.totalCredited} />}
          />
        </Col>
      </Row>

      {(order.workflowStatus === ORDER_STATUSES.closed) && (
        <Row
          data-test-close-reason-block
          start="xs"
        >
          <Col xs={3}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderSummary.closingReason" />}
              value={order.closeReason?.reason}
            />
          </Col>
          <Col xs={9}>
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderSummary.closingNote" />}
              value={order.closeReason?.note}
            />
          </Col>
        </Row>
      )}
    </>
  );
};

SummaryView.propTypes = {
  fiscalYearsGrouped: {
    current: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    })).isRequired,
    previous: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
    })).isRequired,
  },
  hiddenFields: PropTypes.shape({}),
  onSelectFiscalYear: PropTypes.func,
  order: PropTypes.shape({}),
  selectedFiscalYear: PropTypes.string,
};

SummaryView.displayName = 'SummaryView';

export default SummaryView;
