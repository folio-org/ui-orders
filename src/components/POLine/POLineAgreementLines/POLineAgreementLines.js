import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Accordion,
  Badge,
  Icon,
  MultiColumnList,
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
  // eslint-disable-next-line react/prop-types
  name: ({ owner: { id, name } }) => (
    <Link
      data-test-link-to-agreement
      to={`/erm/agreements/${id}`}
    >
      {name}
    </Link>
  ),
  startDate: ({ startDate }) => startDate,
  endDate: ({ endDate }) => endDate,
  // eslint-disable-next-line react/prop-types
  status: ({ owner: { agreementStatus: { label, value } } }) => (
    <FormattedMessage
      id={`ui-orders.relatedAgreementLines.status.${value}`}
      defaultMessage={label}
    />
  ),
  arrow: () => <Icon icon="caret-right" />,
};

const POLineAgreementLines = ({ agreementLines, label }) => {
  return (
    <Accordion
      displayWhenClosed={<Badge>{agreementLines.length}</Badge>}
      id={ACCORDION_ID.relatedAgreementLines}
      label={label}
    >
      <MultiColumnList
        columnMapping={columnMapping}
        contentData={agreementLines}
        formatter={resultFormatter}
        id="po-line-agreement-lines"
        interactive={false}
        rowFormatter={acqRowFormatter}
        rowProps={alignRowProps}
        visibleColumns={visibleColumns}
      />
    </Accordion>
  );
};

POLineAgreementLines.propTypes = {
  agreementLines: PropTypes.arrayOf(PropTypes.object),
  label: PropTypes.node.isRequired,
};

export default POLineAgreementLines;
