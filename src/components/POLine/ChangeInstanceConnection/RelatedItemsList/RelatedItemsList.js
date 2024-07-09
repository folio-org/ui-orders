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

import { usePOLineRelatedItems } from '../../../../common/hooks';
import { useRelatedItemsMCL } from '../hooks';

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

  const {
    columnMapping,
    formatter,
    visibleColumns,
  } = useRelatedItemsMCL();

  if (isLoading) return <Loading />;

  return (
    <>
      <MultiColumnList
        id="po-line-related-items"
        interactive={false}
        columnIdPrefix="related-items"
        columnMapping={columnMapping}
        contentData={items}
        formatter={formatter}
        loading={isFetching}
        totalCount={itemsCount}
        visibleColumns={visibleColumns}
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
