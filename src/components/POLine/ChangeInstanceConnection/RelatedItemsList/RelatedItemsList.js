import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Loading,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  PrevNextPagination,
  RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import {
  ITEMS_COLUMN_MAPPING,
  ITEMS_ROW_FORMATTER,
  ITEMS_VISIBLE_COLUMNS,
} from '../constants';
import { usePOLineRelatedItems } from '../../../../common/hooks';

export const RelatedItemsList = ({ poLine }) => {
  const [pagination, setPagination] = useState({ offset: 0, limit: RESULT_COUNT_INCREMENT });
  const {
    items,
    itemsCount,
    isFetching,
    isLoading,
  } = usePOLineRelatedItems(poLine, {
    ...pagination,
  });

  if (isLoading) return <Loading />;

  return (
    <>
      <MultiColumnList
        id="po-line-related-items"
        interactive={false}
        columnIdPrefix="related-items"
        columnMapping={ITEMS_COLUMN_MAPPING}
        contentData={items}
        formatter={ITEMS_ROW_FORMATTER}
        loading={isFetching}
        totalCount={itemsCount}
        visibleColumns={ITEMS_VISIBLE_COLUMNS}
      />
      {items.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={itemsCount}
          disabled={isFetching}
          onChange={setPagination}
        />
      )}
    </>
  );
};

RelatedItemsList.propTypes = {
  poLine: PropTypes.object.isRequired,
};
