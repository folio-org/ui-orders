import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  Layout,
  Loading,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  COLUMN_MAPPING,
  RESULTS_FORMATTER,
  VISIBLE_COLUMNS,
} from './constants';

export const ExportDetailsList = ({
  data,
  isLoading,
}) => {
  if (isLoading) return <Loading />;

  return (
    <>
      <MultiColumnList
        columnIdPrefix="export-details"
        contentData={data}
        formatter={RESULTS_FORMATTER}
        visibleColumns={VISIBLE_COLUMNS}
        columnMapping={COLUMN_MAPPING}
      />
      <Layout className="textCentered">
        <Icon icon="end-mark">
          <FormattedMessage id="stripes-components.endOfList" />
        </Icon>
      </Layout>
    </>
  );
};

ExportDetailsList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool,
};
