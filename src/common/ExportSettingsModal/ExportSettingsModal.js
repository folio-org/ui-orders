import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'react-final-form';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Label,
  Layout,
  Loading,
  Modal,
  ModalFooter,
  RadioButton,
  RadioButtonGroup,
} from '@folio/stripes/components';
import { FieldMultiSelectionFinal } from '@folio/stripes-acq-components';

import { getExportFieldsOptions } from './utils';
import {
  EXPORT_LINE_FIELDS,
  EXPORT_ORDER_FIELDS,
} from './constants';

const ExportSettingsModal = ({
  onCancel,
  isExporting,
  handleSubmit,
  values,
}) => {
  const intl = useIntl();
  const isExportOrderFieldsDisabled = values.orderExportAll === 'true';
  const isExportLineFieldsDisabled = values.lineExportAll === 'true';
  const orderFieldsOptions = useMemo(() => getExportFieldsOptions(intl, EXPORT_ORDER_FIELDS), [intl]);
  const lineFieldsOptions = useMemo(() => getExportFieldsOptions(intl, EXPORT_LINE_FIELDS), [intl]);

  const isExportBtnDisabled = isExporting ||
    (values.orderExportAll !== 'true' && !values.orderExportFields?.length) ||
    (values.lineExportAll !== 'true' && !values.lineExportFields?.length);

  const exportModalFooter = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={handleSubmit}
        disabled={isExportBtnDisabled}
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
          <form>
            <Label>
              <FormattedMessage id="ui-orders.exportSettings.orderFieldsLabel" />
            </Label>

            <Layout
              className="display-flex flex-align-items-start"
              data-test-order-fields-export
            >
              <Layout
                className="padding-end-gutter"
                data-test-order-radio-buttons
              >
                <Field
                  name="orderExportAll"
                  id="order-export-all"
                  component={RadioButtonGroup}
                  ariaLabel={intl.formatMessage({ id: 'ui-orders.exportSettings.orderFieldsLabel' })}
                >
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.order.all' })}
                    value="true"
                  />
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.order.selected' })}
                    value="false"
                  />
                </Field>

              </Layout>
              <Layout data-test-order-labels>
                <Label>
                  <FormattedMessage id="ui-orders.exportSettings.all" />
                </Label>
                <FieldMultiSelectionFinal
                  name="orderExportFields"
                  id="order-export-fields"
                  dataOptions={orderFieldsOptions}
                  disabled={isExportOrderFieldsDisabled}
                  aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.orderFieldsLabel' })}
                />
              </Layout>
            </Layout>

            <Label>
              <FormattedMessage id="ui-orders.exportSettings.lineFieldsLabel" />
            </Label>

            <Layout
              className="display-flex flex-align-items-start"
              data-test-line-fields-export
            >
              <Layout
                className="padding-end-gutter"
                data-test-line-radio-buttons
              >
                <Field
                  name="lineExportAll"
                  id="line-export-all"
                  component={RadioButtonGroup}
                  ariaLabel={intl.formatMessage({ id: 'ui-orders.exportSettings.lineFieldsLabel' })}
                >
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.line.all' })}
                    value="true"
                  />
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.line.selected' })}
                    value="false"
                  />
                </Field>

              </Layout>
              <Layout data-test-line-labels>
                <Label>
                  <FormattedMessage id="ui-orders.exportSettings.all" />
                </Label>
                <FieldMultiSelectionFinal
                  name="lineExportFields"
                  id="line-export-fields"
                  dataOptions={lineFieldsOptions}
                  disabled={isExportLineFieldsDisabled}
                  fullWidth
                  aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.lineFieldsLabel' })}
                />
              </Layout>
            </Layout>
          </form>
        )
      }
    </Modal>
  );
};

ExportSettingsModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isExporting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(ExportSettingsModal);
