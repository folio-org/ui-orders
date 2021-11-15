import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Modal, ModalFooter, Button } from '@folio/stripes/components';

export const DeleteAcqMethodModal = ({
  canBeDeleted = true,
  nameToDelete,
  open,
  onConfirm,
  onCancel,
}) => {
  const footer = (
    <ModalFooter>
      {
        canBeDeleted && (
          <Button
            buttonStyle="primary"
            onClick={onConfirm}
          >
            <FormattedMessage id="stripes-core.button.delete" />
          </Button>
        )
      }
      <Button
        onClick={onCancel}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={open}
      label={(
        <FormattedMessage
          id="stripes-core.button.deleteEntry"
          values={{ entry: <FormattedMessage id="ui-orders.settings.acquisitionMethods.singular" /> }}
        />
      )}
      footer={footer}
    >
      {
        canBeDeleted
          ? (
            <FormattedMessage
              id="stripes-smart-components.cv.termWillBeDeleted"
              values={{
                type: <FormattedMessage id="ui-orders.settings.acquisitionMethods.singular" />,
                term: nameToDelete,
              }}
            />
          )
          : <FormattedMessage id="ui-orders.settings.acquisitionMethods.remove.inUse" />
      }
    </Modal>
  );
};

DeleteAcqMethodModal.propTypes = {
  nameToDelete: PropTypes.string,
  canBeDeleted: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
