import PropTypes from 'prop-types';
import { useEffect } from 'react';

import {
  Loading,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  PrevNextPagination,
  RESULT_COUNT_INCREMENT,
  useLocalPagination,
  useShowCallout,
} from '@folio/stripes-acq-components';

import { useConsortiumPOLineRelatedItems } from '../../../../common/hooks';
import { useRelatedItemsMCL } from '../hooks';

export const ConsortiumRelatedItemsList = ({ poLine }) => {
  const showCallout = useShowCallout();

  const {
    errors,
    items,
    isLoading,
  } = useConsortiumPOLineRelatedItems(poLine);

  const {
    paginatedData,
    pagination,
    setPagination,
  } = useLocalPagination(items, RESULT_COUNT_INCREMENT);

  const {
    columnMapping,
    formatter,
    visibleColumns,
  } = useRelatedItemsMCL();

  useEffect(() => {
    if (errors?.length) {
      const tenants = [...new Set(errors.map(({ tenantId }) => tenantId))];

      showCallout({
        messageId: 'ui-orders.line.changeInstance.relatedItems.error',
        values: { tenants },
        type: 'error',
      });
    }
  }, [errors, showCallout]);

  if (isLoading) return <Loading />;

  return (
    <>
      <MultiColumnList
        id="consortium-po-line-related-items-list"
        columnMapping={columnMapping}
        contentData={paginatedData}
        totalCount={items.length}
        formatter={formatter}
        interactive={false}
        visibleColumns={visibleColumns}
      />
      {items.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={items.length}
          onChange={setPagination}
          disabled={false}
        />
      )}
    </>
  );
};

ConsortiumRelatedItemsList.propTypes = {
  poLine: PropTypes.object.isRequired,
};
