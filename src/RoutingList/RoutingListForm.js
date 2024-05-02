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
import { AppIcon } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { validateRoutingListForm } from './utils';
import { RoutingListUsers } from './RoutingListUsers';

const RoutingListForm = (props) => {
  const {
    handleSubmit,
    initialValues: {
      metadata,
    },
    intl: {
      formatMessage,
    },
    form: {
      change,
    },
    onCancel,
    paneTitle,
    pristine,
    submitting,
    values,
  } = props;

  const onSave = () => {
    handleSubmit(values);
  };

  const onAddUsers = (selectedUserIds = []) => {
    change('userIds', selectedUserIds);
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
        <FormattedMessage id="ui-orders.routing.list.create.paneMenu.save" />
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
                          required
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
                    <Field
                      component={RoutingListUsers}
                      name="userIds"
                      onAddUsers={onAddUsers}
                      userIds={values.userIds}
                      canEdit
                    />
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

RoutingListForm.propTypes = {
  intl: PropTypes.object.isRequired,
  initialValues: PropTypes.object,
  form: PropTypes.object.isRequired,
  paneTitle: PropTypes.node.isRequired,
  pristine: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  values: PropTypes.object,
};

RoutingListForm.defaultProps = {
  initialValues: {},
};

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
  validate: validateRoutingListForm,
})(injectIntl(RoutingListForm));
