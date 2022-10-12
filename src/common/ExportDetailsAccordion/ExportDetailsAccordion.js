import PropTypes from 'prop-types';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';

import { Accordion } from '@folio/stripes/components';

import { ExportDetailsList } from '../ExportDetailsList';

const ExportDetailsAccordion = ({
  exportHistory,
  id,
  isLoading,
}) => {
  return (
    <Accordion
      id={id}
      label={<FormattedMessage id="ui-orders.paneBlock.exportDetails" />}
    >
      <ExportDetailsList
        data={exportHistory}
        isLoading={isLoading}
      />
    </Accordion>
  );
};

ExportDetailsAccordion.propTypes = {
  exportHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default memo(ExportDetailsAccordion);
