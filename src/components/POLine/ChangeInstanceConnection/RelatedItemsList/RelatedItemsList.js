import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Loading,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  PrevNextPagination,
  RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import { usePOLineRelatedItems } from '../../../../common/hooks';

const VISIBLE_COLUMNS = [
  'barcode',
  'status',
  'copyNumber',
  'loanType',
  'effectiveLocation',
  'enumeration',
  'chronology',
  'volume',
  'yearCaption',
  'materialType',
];

export const COLUMN_MAPPING = {
  barcode: <FormattedMessage id="ui-inventory.item.barcode" />,
  status: <FormattedMessage id="ui-inventory.status" />,
  copyNumber: <FormattedMessage id="ui-inventory.copyNumber" />,
  materialType: <FormattedMessage id="ui-inventory.materialType" />,
  loanType: <FormattedMessage id="ui-inventory.loanType" />,
  effectiveLocation: <FormattedMessage id="ui-inventory.effectiveLocationShort" />,
  enumeration: <FormattedMessage id="ui-inventory.enumeration" />,
  chronology: <FormattedMessage id="ui-inventory.chronology" />,
  volume: <FormattedMessage id="ui-inventory.volume" />,
  yearCaption: <FormattedMessage id="ui-inventory.yearCaption" />,
};

const ROW_FORMATTER = {
  barcode: item => item.barcode || <NoValue />,
  status: item => item.status?.name || <NoValue />,
  copyNumber: item => item.copyNumber || <NoValue />,
  materialType: item => item.materialType?.name || <NoValue />,
  loanType: item => item.temporaryLoanType?.name || <NoValue />,
  effectiveLocation: item => item.effectiveLocation?.name || <NoValue />,
  enumeration: item => item.enumeration || <NoValue />,
  chronology: item => item.chronology || <NoValue />,
  volume: item => item.volume || <NoValue />,
  yearCaption: item => item.yearCaption?.join(', ') || <NoValue />,
};

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
        columnMapping={COLUMN_MAPPING}
        contentData={items}
        formatter={ROW_FORMATTER}
        loading={isFetching}
        totalCount={itemsCount}
        visibleColumns={VISIBLE_COLUMNS}
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
