import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Headline,
  Label,
  Loading,
  Modal,
  ModalFooter,
  RadioButton,
} from '@folio/stripes/components';

const ExportSettingsModal = ({
  onCancel,
  isExporting,
  onExportCSV,
}) => {
  const onExport = useCallback(
    async () => {
      await onExportCSV();
      onCancel();
    },
    [onExportCSV, onCancel],
  );
  const exportModalFooter = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={onExport}
        disabled={isExporting}
      >
        <FormattedMessage id="ui-orders.exportSettings.export" />
      </Button>
      <Button onClick={onCancel}>
        <FormattedMessage id="ui-orders.exportSettings.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open
      label={<FormattedMessage id="ui-orders.exportSettings.label" />}
      footer={exportModalFooter}
    >

      <p><FormattedMessage id="ui-orders.exportSettings.message" /></p>

      {isExporting
        ? <Loading size="large" />
        : (
          <>
            <Label>
              <FormattedMessage id="ui-orders.exportSettings.orderFieldsLabel" />
            </Label>
            <RadioButton
              checked
              label={<FormattedMessage id="ui-orders.exportSettings.all" />}
            />
            <Label>
              <FormattedMessage id="ui-orders.exportSettings.lineFieldsLabel" />
            </Label>
            <RadioButton
              checked
              label={<FormattedMessage id="ui-orders.exportSettings.all" />}
            />
          </>
        )
      }
    </Modal>
  );
};

ExportSettingsModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isExporting: PropTypes.bool.isRequired,
  onExportCSV: PropTypes.bool.isRequired,
};

export default ExportSettingsModal;
