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
  TextField,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { AppIcon, Pluggable, useStripes } from '@folio/stripes/core';
import { map, uniq } from 'lodash';

const RoutingListEdit = (props) => {
  const stripes = useStripes();
  const {
    handleSubmit,
    initialValues: {
      metadata,
      userIds,
    },
    intl: {
      formatMessage,
    },
    onCancel,
    paneTitle,
    pristine,
    submitting,
    values,
  } = props;

  console.log('RoutingListEdit props', props);

  const onSave = () => {
    handleSubmit(values);
  };

  const onAddUsers = (users = []) => {
    const addedDonorIds = uniq(users.map(({ id }) => id));
    const newDonorsIds = values.filter((id) => !addedDonorIds.has(id));

    console.log('onAddUsers', users, addedDonorIds, newDonorsIds);

    if (newDonorsIds.length) {
      // setDonorIds([...addedDonorIds, ...newDonorsIds]);
      // newDonorsIds.forEach(contactId => fields.push(contactId));
    }
  };

  const renderHeader = (paneHeaderProps) => {
    return (
      <PaneHeader
        {...paneHeaderProps}
        dismissible
        onClose={onCancel}
        paneTitle={paneTitle}
      />
    );
  };

  const renderFooter = () => {
    const saveButton = (
      <Button
        buttonStyle="primary mega"
        marginBottom0
        disabled={(pristine || submitting)}
        id="routing-list-save-button"
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
            id="routing-list-pane"
            appIcon={<AppIcon app="orders" appIconKey="orders" />}
            defaultWidth="fill"
            renderHeader={renderHeader}
            footer={renderFooter()}
          >
            <form id="routing-list-form">
              <AccordionStatus>
                <Row end="xs">
                  <Col data-test-expand-all>
                    <ExpandAllButton />
                  </Col>
                </Row>
                <AccordionSet>
                  <Accordion label={formatMessage({ id: 'ui-orders.routing.list.generalInformation' })}>
                    <AccordionSet>
                      <ViewMetaData metadata={metadata} />
                    </AccordionSet>
                    <Row>
                      <Col xs={12}>
                        <Field
                          label={formatMessage({ id: 'ui-orders.routing.list.name' })}
                          name="name"
                          id="input-routing-list-name"
                          component={TextField}
                        />
                      </Col>
                      <Col xs={12}>
                        <Field
                          label={formatMessage({ id: 'ui-orders.routing.list.notes' })}
                          name="notes"
                          id="input-routing-list-notes"
                          component={TextArea}
                        />
                      </Col>
                    </Row>
                  </Accordion>
                  <Accordion label={formatMessage({ id: 'ui-orders.routing.list.users' })}>
                    <Pluggable
                      aria-haspopup="true"
                      dataKey="assignUsers"
                      searchButtonStyle="default"
                      searchLabel={<FormattedMessage id="ui-orders.routing.list.addUsers" />}
                      stripes={stripes}
                      type="find-user"
                      selectUsers={onAddUsers}
                      initialSelectedUsers={{}}
                      // tenantId={tenantId}
                    >
                      <FormattedMessage id="ui-users.permissions.assignUsers.actions.assign.notAvailable" />
                    </Pluggable>
                    {/* <Row>
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
                    </Row> */}
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

RoutingListEdit.propTypes = {
  intl: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  form: PropTypes.object.isRequired,
  paneTitle: PropTypes.node.isRequired,
  pristine: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  values: PropTypes.object,
};

RoutingListEdit.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(injectIntl(RoutingListEdit));
