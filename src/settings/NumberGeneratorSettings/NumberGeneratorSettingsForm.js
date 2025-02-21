import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  Accordion,
  AccordionSet,
  Button,
  Checkbox,
  Col,
  MessageBanner,
  Pane,
  PaneFooter,
  PaneHeader,
  Row,
  Select,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  NUMBER_GENERATOR_OPTIONS,
  NUMBER_GENERATOR_OPTIONS_OFF,
  SERVICE_INTERACTION_API,
  SERVICE_INTERACTION_NUMBER_GENERATOR_SEQUENCES_API,
  USE_SHARED_NUMBER,
} from './constants';
import css from './NumberGeneratorSettings.css';

const NumberGeneratorSettingsForm = ({
  handleSubmit,
  pristine,
  submitting,
  values,
}) => {
  const intl = useIntl();

  const disableSharedNumber =
    values?.accessionNumber === NUMBER_GENERATOR_OPTIONS_OFF ||
    values?.callNumber === NUMBER_GENERATOR_OPTIONS_OFF;
  const disableGeneratorOffOption = values?.useSharedNumber;

  const getTranslatedDataOptions = (field, shouldDisableOff) => {
    return field.map(item => ({
      label: item.value ? intl.formatMessage({ id: `ui-orders.settings.numberGenerator.options.${item.value}` }) : '',
      value: item.value,
      disabled: shouldDisableOff && item.value === NUMBER_GENERATOR_OPTIONS_OFF,
    }));
  };

  const dataOptionsAllEnabled = getTranslatedDataOptions(NUMBER_GENERATOR_OPTIONS, false);
  const dataOptionsOffDisabled = getTranslatedDataOptions(NUMBER_GENERATOR_OPTIONS, disableGeneratorOffOption);

  const paneHeader = (renderProps) => (
    <PaneHeader
      {...renderProps}
      paneTitle={<FormattedMessage id="ui-orders.settings.numberGenerator.options" />}
    />
  );

  const paneFooter = (
    <PaneFooter
      renderEnd={
        <Button
          buttonStyle="primary mega"
          disabled={pristine || submitting}
          id="clickable-save-number-generator-settings"
          onClick={handleSubmit}
          type="submit"
        >
          <FormattedMessage id="stripes-core.button.save" />
        </Button>
      }
    />
  );

  return (
    <form id="numberGeneratorSettingsForm">
      <Pane defaultWidth="fill" footer={paneFooter} id="number-generator-settings-form" renderHeader={paneHeader}>
        <Row className={css.marginBottomGutterDouble}>
          <Col xs={12}>
            <MessageBanner>
              <p><FormattedMessage id="ui-orders.settings.numberGenerator.info" /></p>
              <p>
                <FormattedMessage
                  id="ui-orders.settings.numberGenerator.infoAdditional"
                  values={{
                    serviceInteractionLink: (
                      <Link to={SERVICE_INTERACTION_API}>
                        <FormattedMessage id="stripes-core.settings" />{' > '}
                        <FormattedMessage id="ui-orders.settings.numberGenerator.infoAdditional.serviceInteraction" />
                      </Link>
                    ),
                    numberGeneratorSequencesLink: (
                      <Link to={SERVICE_INTERACTION_NUMBER_GENERATOR_SEQUENCES_API}>
                        <FormattedMessage id="stripes-core.settings" />{' > '}
                        <FormattedMessage id="ui-orders.settings.numberGenerator.infoAdditional.serviceInteraction" />{' > '}
                        <FormattedMessage id="ui-orders.settings.numberGenerator.infoAdditional.numberGeneratorSequences" />
                      </Link>
                    ),
                  }}
                />
              </p>
            </MessageBanner>
          </Col>
        </Row>
        <AccordionSet>
          <Accordion
            id="acc01"
            label={<FormattedMessage id="ui-orders.settings.numberGenerator.receiving" />}
          >
            <Row className={css.marginBottomGutterDouble}>
              <Col xs={6}>
                <Field
                  component={Select}
                  id={BARCODE_SETTING}
                  label={<FormattedMessage id="ui-orders.settings.numberGenerator.barcode" />}
                  name={BARCODE_SETTING}
                  dataOptions={dataOptionsAllEnabled}
                />
              </Col>
            </Row>
            <Row className={css.marginBottomGutterDouble}>
              <Col xs={6}>
                <Field
                  component={Select}
                  id={ACCESSION_NUMBER_SETTING}
                  label={<FormattedMessage id="ui-orders.settings.numberGenerator.accessionNumber" />}
                  name={ACCESSION_NUMBER_SETTING}
                  dataOptions={dataOptionsOffDisabled}
                />
              </Col>
            </Row>
            <Row className={css.marginBottomGutterDouble}>
              <Col xs={6}>
                <Field
                  component={Select}
                  id={CALL_NUMBER_SETTING}
                  label={<FormattedMessage id="ui-orders.settings.numberGenerator.callNumber" />}
                  name={CALL_NUMBER_SETTING}
                  dataOptions={dataOptionsOffDisabled}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Field
                  component={Checkbox}
                  disabled={disableSharedNumber}
                  id={USE_SHARED_NUMBER}
                  label={<FormattedMessage id="ui-orders.settings.numberGenerator.accessionNumberEqualCallNumber" />}
                  name={USE_SHARED_NUMBER}
                  type="checkbox"
                />
                {disableSharedNumber &&
                  <MessageBanner type="warning">
                    <FormattedMessage id="ui-orders.settings.numberGenerator.accessionNumberEqualCallNumber.warning" />
                  </MessageBanner>
                }
              </Col>
            </Row>
          </Accordion>
        </AccordionSet>
      </Pane>
    </form>
  );
};

NumberGeneratorSettingsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object,
};

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(NumberGeneratorSettingsForm);
