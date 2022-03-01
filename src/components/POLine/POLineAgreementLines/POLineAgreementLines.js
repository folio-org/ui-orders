import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Accordion,
  Badge,
  Icon,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  acqRowFormatter,
} from '@folio/stripes-acq-components';

import { ACCORDION_ID } from '../const';

const visibleColumns = ['name', 'startDate', 'endDate', 'status', 'arrow'];
const columnMapping = {
  name: <FormattedMessage id="ui-orders.relatedAgreementLines.name" />,
  startDate: <FormattedMessage id="ui-orders.relatedAgreementLines.startDate" />,
  endDate: <FormattedMessage id="ui-orders.relatedAgreementLines.endDate" />,
  status: <FormattedMessage id="ui-orders.relatedAgreementLines.status" />,
  arrow: null,
};
const alignRowProps = { alignLastColToEnd: true };
const resultFormatter = {
  name: (agrLine) => (!agrLine.owner?.id ? <NoValue /> : (
    <Link
      data-test-link-to-agreement
      to={`/erm/agreements/${agrLine.owner.id}/line/${agrLine.id}`}
    >
      {agrLine.owner.name}
    </Link>
  )),
  startDate: ({ startDate }) => startDate || '',
  endDate: ({ endDate }) => endDate || '',
  status: agreement => {
    const { owner } = agreement;

    return owner?.agreementStatus?.value
      ? (
        <FormattedMessage
          id={`ui-orders.relatedAgreementLines.status.${owner?.agreementStatus?.value}`}
          defaultMessage={owner?.agreementStatus?.label}
        />
      )
      : owner?.agreementStatus?.label || <NoValue />;
  },
  arrow: () => <Icon icon="caret-right" />,
};

const POLineAgreementLines = ({ agreementLines, label, onNeedMoreData, totalCount }) => {
  return (
    <Accordion
      displayWhenClosed={<Badge>{totalCount}</Badge>}
      id={ACCORDION_ID.relatedAgreementLines}
      label={label}
    >
      <MultiColumnList
        columnMapping={columnMapping}
        contentData={agreementLines}
        formatter={resultFormatter}
        id="po-line-agreement-lines"
        interactive={false}
        maxHeight={800}
        onNeedMoreData={onNeedMoreData}
        pagingType="click"
        rowFormatter={acqRowFormatter}
        rowProps={alignRowProps}
        totalCount={totalCount}
        virtualize
        visibleColumns={visibleColumns}
        columnIdPrefix="agreement-lines"
      />
    </Accordion>
  );
};

POLineAgreementLines.propTypes = {
  agreementLines: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.node.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default POLineAgreementLines;
