import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import DuplicateLinesList from './DuplicateLinesList';

const DuplicateLinesModal = ({ duplicateLines, onSubmit, onCancel }) => {
  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={onSubmit}
      >
        <FormattedMessage id="ui-orders.buttons.line.submit" />
      </Button>

      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-orders.buttons.line.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      footer={footer}
      id="line-is-not-unique-confirmation"
      label={<FormattedMessage id="ui-orders.duplicateLines.confirmation.heading" />}
      open
    >
      <FormattedMessage id="ui-orders.duplicateLines.confirmation.message" />
      <hr />
      <DuplicateLinesList lines={duplicateLines} />
    </Modal>
  );
};

DuplicateLinesModal.propTypes = {
  duplicateLines: PropTypes.arrayOf(PropTypes.object),
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DuplicateLinesModal;
