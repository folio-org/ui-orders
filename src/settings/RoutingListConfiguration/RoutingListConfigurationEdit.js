import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  ExpandAllButton,
  Layer,
  Pane,
  PaneFooter,
  PaneHeader,
  Paneset,
  Row,
  TextArea,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { TemplateEditor } from '@folio/stripes-template-editor';

import { ROUTING_LIST_TOKEN } from './constants';
import TokensList from './TokensList';

const EditRoutingListConfiguration = (props) => {
  const {
    handleSubmit,
    initialValues: {
      metadata,
    },
    intl: {
      formatMessage,
    },
    onCancel,
    pristine,
    submitting,
    values,
  } = props;

  const onSave = () => {
    handleSubmit(values);
  };

  const renderHeader = (paneHeaderProps) => {
    return (
      <PaneHeader
        {...paneHeaderProps}
        dismissible
        onClose={onCancel}
        paneTitle={formatMessage({ id: 'ui-orders.settings.routing.listConfiguration' })}
      />
    );
  };

  const renderFooter = () => {
    const saveButton = (
      <Button
        buttonStyle="primary mega"
        marginBottom0
        disabled={(pristine || submitting)}
        id="routing-list-configuration-save-button"
        onClick={onSave}
        type="submit"
      >
        <FormattedMessage id="stripes-core.button.save" />
      </Button>
    );

    const cancelButton = (
      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    );

    return (
      <PaneFooter
        renderEnd={saveButton}
        renderStart={cancelButton}
      />
    );
  };

  return (
    <Paneset>
      <Layer isOpen>
        <Paneset isRoot>
          <Pane
            id="routing-list-configuration-pane"
            defaultWidth="fill"
            renderHeader={renderHeader}
            footer={renderFooter()}
          >
            <form id="routing-list-configuration-form">
              <AccordionStatus>
                <Row end="xs">
                  <Col data-test-expand-all>
                    <ExpandAllButton />
                  </Col>
                </Row>
                <AccordionSet>
                  <Accordion label={formatMessage({ id: 'ui-orders.settings.routing.listConfiguration.generalInformation' })}>
                    <AccordionSet>
                      <ViewMetaData metadata={metadata} />
                    </AccordionSet>
                    <Row>
                      <Col xs={12}>
                        <Field
                          data-testid="routingListConfigurationDescription"
                          label={formatMessage({ id: 'ui-orders.settings.routing.listConfiguration.description' })}
                          name="description"
                          id="input-listing-configuration-description"
                          component={TextArea}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion label={formatMessage({ id: 'ui-orders.settings.routing.listConfiguration.templateContent' })}>
                    <Row>
                      <Col xs={12}>
                        <Field
                          data-testid="routingListConfigurationBody"
                          label={<strong><FormattedMessage id="ui-orders.settings.routing.listConfiguration.body" /></strong>}
                          required
                          name="localizedTemplates.en.body"
                          id="input-routing-list-template-body"
                          component={TemplateEditor}
                          tokens={ROUTING_LIST_TOKEN}
                          tokensList={TokensList}
                          previewModalHeader={<FormattedMessage id="ui-orders.settings.routing.listConfiguration.previewHeader" />}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                </AccordionSet>
              </AccordionStatus>
            </form>
          </Pane>
        </Paneset>
      </Layer>
    </Paneset>
  );
};

EditRoutingListConfiguration.propTypes = {
  intl: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  form: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  values: PropTypes.object,
};

EditRoutingListConfiguration.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(injectIntl(EditRoutingListConfiguration));
