import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Loading,
  Modal,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  ITEMS_COLUMN_MAPPING,
  ITEMS_ROW_FORMATTER,
  ITEMS_VISIBLE_COLUMNS,
} from '../constants';
import { useNotMovedItems } from '../hooks';

export const NotMovedItemsModal = ({ itemIds = [], onClose }) => {
  const intl = useIntl();
  const {
    items,
    itemsCount,
    isLoading,
  } = useNotMovedItems(itemIds);

  const modalLabel = intl.formatMessage({ id: 'ui-orders.line.changeInstance.notMovedItems' });

  return (
    <Modal
      aria-label={modalLabel}
      open
      dismissible
      onClose={onClose}
      label={modalLabel}
    >
      {
        isLoading
          ? <Loading />
          : (
            <MultiColumnList
              id="po-line-related-items"
              interactive={false}
              columnIdPrefix="related-items"
              columnMapping={ITEMS_COLUMN_MAPPING}
              contentData={items}
              formatter={ITEMS_ROW_FORMATTER}
              totalCount={itemsCount}
              visibleColumns={ITEMS_VISIBLE_COLUMNS}
            />
          )
      }
    </Modal>
  );
};

NotMovedItemsModal.propTypes = {
  itemIds: PropTypes.arrayOf(PropTypes.string),
  onClose: PropTypes.func.isRequired,
};
