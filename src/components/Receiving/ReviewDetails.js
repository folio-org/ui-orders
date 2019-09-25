import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import {
  Checkbox,
  MultiColumnList,
} from '@folio/stripes/components';

const ReviewDetails = ({
  allChecked,
  checkedItemsList,
  locationsOptions,
  toggleAll,
  toggleItem,
}) => {
  const isSelected = ({ item }) => item.isSelected;
  const resultFormatter = {
    'isChecked': (item) => (
      <Checkbox
        type="checkbox"
        onChange={() => toggleItem(item)}
        checked={item.isSelected}
      />
    ),
    'poLine': (item) => get(item, 'poLineNumber', ''),
    'title': (item) => get(item, 'title', ''),
    'barcode': (item) => get(item, 'barcode', ''),
    'comment': (item) => get(item, 'comment', ''),
    'format': (item) => get(item, 'pieceFormat', ''),
    'location': (item) => get(locationsOptions.filter(el => (
      el.value === item.locationId)), [0, 'label'], 'Unknown location'),
    'itemStatus': (item) => <FormattedMessage id={`ui-orders.receiving.itemStatus.${item.itemStatus}`} />,
  };

  return (
    <MultiColumnList
      contentData={checkedItemsList}
      formatter={resultFormatter}
      visibleColumns={['isChecked', 'poLine', 'title', 'barcode', 'comment', 'format', 'location', 'itemStatus']}
      columnMapping={{
        isChecked: <Checkbox type="checkbox" checked={allChecked.reviewDetails} onChange={() => toggleAll('reviewDetails')} />,
        poLine: <FormattedMessage id="ui-orders.receiving.poLine" />,
        title: <FormattedMessage id="ui-orders.receiving.title" />,
        barcode: <FormattedMessage id="ui-orders.receiving.barcode" />,
        comment: <FormattedMessage id="ui-orders.receiving.comment" />,
        format: <FormattedMessage id="ui-orders.receiving.format" />,
        location: <FormattedMessage id="ui-orders.receiving.location" />,
        itemStatus: <FormattedMessage id="ui-orders.receiving.itemStatus" />,
      }}
      onRowClick={undefined}
      isSelected={isSelected}
    />
  );
};

ReviewDetails.propTypes = {
  allChecked: PropTypes.object.isRequired,
  checkedItemsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  locationsOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggleAll: PropTypes.func.isRequired,
  toggleItem: PropTypes.func.isRequired,
};

export default ReviewDetails;
