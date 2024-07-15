import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Loading,
  Modal,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  useNotMovedItems,
  useRelatedItemsMCL,
} from '../hooks';

export const NotMovedItemsModal = ({ itemIds = [], onClose }) => {
  const intl = useIntl();
  const {
    items,
    itemsCount,
    isLoading,
  } = useNotMovedItems(itemIds);

  const {
    columnMapping,
    formatter,
    visibleColumns,
  } = useRelatedItemsMCL();

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
              columnMapping={columnMapping}
              contentData={items}
              formatter={formatter}
              totalCount={itemsCount}
              visibleColumns={visibleColumns}
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
