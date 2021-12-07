import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';

import stripesForm from '@folio/stripes/final-form';
import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  IconButton,
  MenuSection,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import {
  FieldSelectionFinal as FieldSelection,
  handleKeyCommand,
} from '@folio/stripes-acq-components';

import {
  getAddresses,
} from '../../common/utils';
import { isOngoing } from '../../common/POFields';
import getOrderNumberSetting from '../../common/utils/getOrderNumberSetting';
import getOrderTemplatesForSelect from '../Utils/getOrderTemplatesForSelect';
import getOrderTemplateValue from '../Utils/getOrderTemplateValue';
import { getFullOrderNumber } from '../Utils/orderResource';

import { PODetailsForm } from './PODetails';
import { SummaryForm } from './Summary';
import { OngoingInfoForm } from './OngoingOgderInfo';
import { PO_TEMPLATE_FIELDS_MAP } from './constants';

class POForm extends Component {
  static propTypes = {
    values: PropTypes.object,
    form: PropTypes.object.isRequired,
    generatedNumber: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.accordionStatusRef = React.createRef();

    this.state = {
      hiddenFields: {},
    };
  }

  componentDidMount() {
    const { parentResources, initialValues } = this.props;
    let hiddenFields = {};
    let orderTemplate;

    if (initialValues.template) {
      orderTemplate = parentResources?.orderTemplates?.records?.find(
        ({ id }) => id === initialValues.template,
      );

      hiddenFields = orderTemplate?.hiddenFields || {};
    }

    this.setState(prev => ({
      ...prev,
      template: orderTemplate,
      hiddenFields,
    }));
  }

  callAPI = (fieldName, formValues) => {
    const fullOrderNumber = getFullOrderNumber(formValues);
    const { parentMutator: { orderNumber: validator }, values } = this.props;
    const poNumber = formValues.poNumber;
    const initialFullOrderNumber = getFullOrderNumber(values);

    return poNumber && initialFullOrderNumber !== fullOrderNumber
      ? validator.POST({ poNumber: fullOrderNumber })
        .then(() => { })
        .catch(() => <FormattedMessage id="ui-orders.errors.orderNumberIsNotValid" />)
      : Promise.resolve();
  }

  validateNumber = (poNumber, formValues) => {
    const { form } = this.props;
    const isDirty = form.getFieldState('poNumber').dirty;

    return poNumber && isDirty
      ? this.callAPI('poNumber', formValues)
      : Promise.resolve();
  };

  getAddFirstMenu() {
    const { onCancel } = this.props;

    return (
      <PaneMenu>
        <FormattedMessage id="ui-orders.buttons.line.close">
          {([title]) => (
            <IconButton
              ariaLabel={title}
              icon="times"
              id="clickable-close-new-purchase-order-dialog"
              onClick={onCancel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  getActionMenu = ({ onToggle }) => (
    Boolean(this.state.template?.hiddenFields) && (
      <MenuSection id="po-form-actions">
        <IfPermission perm="ui-orders.order.showHidden">
          <Button
            id="clickable-show-hidden"
            buttonStyle="dropdownItem"
            data-testid="toggle-fields-visibility"
            onClick={() => {
              this.toggleForceVisibility();
              onToggle();
            }}
          >
            <Icon size="small" icon={`eye-${this.state.hiddenFields ? 'open' : 'closed'}`}>
              <FormattedMessage id={`ui-orders.order.${this.state.hiddenFields ? 'showHidden' : 'hideFields'}`} />
            </Icon>
          </Button>
        </IfPermission>
      </MenuSection>
    )
  );

  getPaneFooter(id, label) {
    const { pristine, submitting, handleSubmit, onCancel } = this.props;

    const start = (
      <FormattedMessage id="ui-orders.buttons.line.cancel">
        {(btnLabel) => (
          <Button
            id="clickable-close-new-purchase-order-dialog-footer"
            buttonStyle="default mega"
            onClick={onCancel}
          >
            {btnLabel}
          </Button>
        )}
      </FormattedMessage>
    );

    const end = (
      <FormattedMessage id={label}>
        {btnLabel => (
          <Button
            id={id}
            type="submit"
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            onClick={handleSubmit}
          >
            {btnLabel}
          </Button>
        )}
      </FormattedMessage>
    );

    return (
      <PaneFooter
        renderStart={start}
        renderEnd={end}
      />
    );
  }

  onChangeTemplate = (value) => {
    const { form: { batch, change, getRegisteredFields }, parentResources } = this.props;
    const templateValue = getOrderTemplateValue(parentResources, value);

    this.setState(prev => ({
      ...prev,
      template: templateValue,
      hiddenFields: prev.hiddenFields ? (templateValue?.hiddenFields || {}) : undefined,
    }));

    batch(() => {
      change('template', value);
      change('vendor', null);
      change('assignedTo', null);
      change('manualPo', false);
      change('reEncumber', false);
      change('orderType', null);
      change('acqUnitIds', []);
      change('tags', { tagList: [] });
      change('notes', []);
      change('billTo', null);
      change('shipTo', null);
    });

    getRegisteredFields()
      .forEach(field => {
        const templateField = PO_TEMPLATE_FIELDS_MAP[field] || field;
        const templateFieldValue = get(templateValue, templateField);

        if (templateFieldValue) change(field, templateFieldValue);
      });
    if (isOngoing(templateValue.orderType)) {
      change('ongoing', templateValue.ongoing || {});
      setTimeout(() => {
        getRegisteredFields()
          .forEach(field => get(templateValue, field) && change(field, get(templateValue, field)));
      });
    }
  };

  toggleForceVisibility = () => {
    this.setState(({ hiddenFields, template, ...rest }) => ({
      ...rest,
      template,
      hiddenFields: hiddenFields ? undefined : template?.hiddenFields || {},
    }));
  };

  render() {
    const {
      form: { change },
      values: formValues,
      generatedNumber,
      handleSubmit,
      pristine,
      submitting,
      history,
      initialValues,
      onCancel,
      parentResources,
    } = this.props;
    const firstMenu = this.getAddFirstMenu();
    const actionMenu = args => this.getActionMenu(args);
    const orderNumber = getFullOrderNumber(initialValues);
    const paneTitle = initialValues.id
      ? <FormattedMessage id="ui-orders.order.paneTitle.edit" values={{ orderNumber }} />
      : <FormattedMessage id="ui-orders.paneMenu.createPurchaseOrder" />;
    const paneFooter = initialValues.id ?
      this.getPaneFooter('clickable-update-purchase-order', 'ui-orders.paneMenu.saveOrder') :
      this.getPaneFooter('clickable-create-new-purchase-order', 'ui-orders.paneMenu.saveOrder');
    const orderNumberSetting = getOrderNumberSetting(get(parentResources, 'orderNumberSetting.records', {}));
    const prefixesSetting = get(parentResources, 'prefixesSetting.records', [])
      .map(({ name }) => ({ label: name, value: name }));
    const suffixesSetting = get(parentResources, 'suffixesSetting.records', [])
      .map(({ name }) => ({ label: name, value: name }));
    const addresses = getAddresses(get(parentResources, 'addresses.records', []));
    const orderTemplates = getOrderTemplatesForSelect(parentResources);
    const poLinesLength = get(initialValues, 'compositePoLines', []).length;

    const shortcuts = [
      {
        name: 'cancel',
        shortcut: 'esc',
        handler: handleKeyCommand(onCancel),
      },
      {
        name: 'save',
        handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
      },
      {
        name: 'expandAllSections',
        handler: (e) => expandAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'collapseAllSections',
        handler: (e) => collapseAllSections(e, this.accordionStatusRef),
      },
      {
        name: 'search',
        handler: handleKeyCommand(() => history.push('/orders')),
      },
    ];

    if (!initialValues) {
      return (
        <Pane
          defaultWidth="fill"
          firstMenu={firstMenu}
          id="pane-podetails"
          footer={paneFooter}
          onClose={onCancel}
          paneTitle={<FormattedMessage id="ui-orders.order.paneTitle.detailsLoading" />}
        >
          <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
        </Pane>
      );
    }

    return (
      <div style={{ height: '100vh' }}>
        <HasCommand
          commands={shortcuts}
          isWithinScope={checkScope}
          scope={document.body}
        >
          <Paneset>
            <Pane
              defaultWidth="100%"
              firstMenu={firstMenu}
              actionMenu={actionMenu}
              id="pane-poForm"
              footer={paneFooter}
              onClose={onCancel}
              paneTitle={paneTitle}
            >
              <form
                id="form-po"
                data-test-form-page
              >
                <Row>
                  <Col xs={12}>
                    <AccordionStatus ref={this.accordionStatusRef}>
                      <Row center="xs">
                        <Col xs={12} md={8}>
                          <Row end="xs">
                            <Col xs={12}>
                              <ExpandAllButton />
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={12} md={8}>
                          <Row>
                            <Col xs={4}>
                              <FieldSelection
                                dataOptions={orderTemplates}
                                onChange={this.onChangeTemplate}
                                labelId="ui-orders.settings.orderTemplates.editor.template.name"
                                name="template"
                                id="order-template"
                                disabled={poLinesLength}
                              />
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={12} md={8} style={{ textAlign: 'left' }}>
                          <AccordionSet>
                            <Accordion
                              id="purchaseOrder"
                              label={<FormattedMessage id="ui-orders.paneBlock.purchaseOrder" />}
                            >
                              <PODetailsForm
                                addresses={addresses}
                                change={change}
                                formValues={formValues}
                                generatedNumber={generatedNumber}
                                order={initialValues}
                                orderNumberSetting={orderNumberSetting}
                                prefixesSetting={prefixesSetting}
                                suffixesSetting={suffixesSetting}
                                validateNumber={this.validateNumber}
                                hiddenFields={this.state.hiddenFields}
                              />
                            </Accordion>
                            <OngoingInfoForm hiddenFields={this.state.hiddenFields} />
                            <Accordion
                              id="POSummary"
                              label={<FormattedMessage id="ui-orders.paneBlock.POSummary" />}
                            >
                              <SummaryForm
                                initialValues={initialValues}
                                hiddenFields={this.state.hiddenFields}
                              />
                            </Accordion>
                          </AccordionSet>
                        </Col>
                      </Row>
                    </AccordionStatus>
                  </Col>
                </Row>
              </form>
            </Pane>
          </Paneset>
        </HasCommand>
      </div>
    );
  }
}

export default withRouter(stripesForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(POForm));
