import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  isDirty,
} from 'redux-form';

import stripesForm from '@folio/stripes/form';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneMenu,
  PaneFooter,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { FieldSelection } from '@folio/stripes-acq-components';

import {
  PO_FORM_NAME,
} from '../../common/constants';
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

const throwError = () => {
  const errorInfo = { poNumber: <FormattedMessage id="ui-orders.errors.orderNumberIsNotValid" /> };

  throw errorInfo;
};

const asyncValidate = (values, dispatchRedux, props) => {
  const { poNumber } = values;
  const fullOrderNumber = getFullOrderNumber(values);
  const { parentMutator: { orderNumber: validator }, stripes: { store } } = props;
  const orderNumberFieldIsDirty = isDirty(PO_FORM_NAME)(store.getState(), ['poNumber']);

  return orderNumberFieldIsDirty && poNumber
    ? validator.POST({ poNumber: fullOrderNumber })
      .catch(response => response.json()
        .catch(() => throwError())
        .then(() => throwError()))
    : Promise.resolve();
};

class POForm extends Component {
  static propTypes = {
    formValues: PropTypes.object,
    generatedNumber: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    parentResources: PropTypes.object.isRequired,
    parentMutator: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    stripes: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        purchaseOrder: true,
        POSummary: true,
        renewals: true,
      },
    };
  }

  getAddFirstMenu() {
    const { onCancel } = this.props;

    return (
      <PaneMenu>
        <FormattedMessage id="ui-orders.buttons.line.close">
          {(title) => (
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

  onToggleSection = ({ id }) => {
    this.setState(({ sections }) => {
      const isSectionOpened = sections[id];

      return {
        sections: {
          ...sections,
          [id]: !isSectionOpened,
        },
      };
    });
  }

  handleExpandAll = (sections) => {
    this.setState({ sections });
  }

  onChangeTemplate = (e, value) => {
    const { change, dispatch, parentResources, stripes } = this.props;
    const templateValue = getOrderTemplateValue(parentResources, value);
    let form = get(stripes.store.getState(), 'form', {});

    dispatch(change('template', value));
    dispatch(change('vendor', ''));
    dispatch(change('assignedToUser', ''));
    dispatch(change('manualPo', false));
    dispatch(change('reEncumber', false));
    dispatch(change('orderType', ''));
    dispatch(change('acqUnitIds', []));
    dispatch(change('tags', { tagList: [] }));
    dispatch(change('notes', []));
    dispatch(change('billTo', ''));
    dispatch(change('shipTo', ''));

    Object.keys(get(form, [PO_FORM_NAME, 'registeredFields'], {}))
      .forEach(field => {
        const templateField = PO_TEMPLATE_FIELDS_MAP[field] || field;
        const templateFieldValue = get(templateValue, templateField);

        if (templateFieldValue) dispatch(change(field, templateFieldValue));
      });
    if (isOngoing(templateValue.orderType)) {
      dispatch(change('ongoing', templateValue.ongoing || {}));
      setTimeout(() => {
        form = get(stripes.store.getState(), 'form', {});
        Object.keys(get(form, [PO_FORM_NAME, 'registeredFields'], {}))
          .forEach(field => get(templateValue, field) && dispatch(change(field, get(templateValue, field))));
      });
    }
  };

  render() {
    const {
      change,
      dispatch,
      formValues = {},
      generatedNumber,
      initialValues,
      onCancel,
      parentResources,
      stripes,
    } = this.props;
    const { sections } = this.state;
    const firstMenu = this.getAddFirstMenu();
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
        <Paneset>
          <Pane
            defaultWidth="100%"
            firstMenu={firstMenu}
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
                  <Row center="xs">
                    <Col xs={12} md={8}>
                      <Row end="xs">
                        <Col xs={12}>
                          <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
                        </Col>
                      </Row>
                    </Col>

                    {(!initialValues.id || !poLinesLength) && (
                      <Col xs={12} md={8}>
                        <Row>
                          <Col xs={4}>
                            <FieldSelection
                              dataOptions={orderTemplates}
                              onChange={this.onChangeTemplate}
                              labelId="ui-orders.settings.orderTemplates.editor.template.name"
                              name="template"
                              id="order-template"
                            />
                          </Col>
                        </Row>
                      </Col>
                    )}

                    <Col xs={12} md={8} style={{ textAlign: 'left' }}>
                      <AccordionSet accordionStatus={sections} onToggle={this.onToggleSection}>
                        <Accordion
                          id="purchaseOrder"
                          label={<FormattedMessage id="ui-orders.paneBlock.purchaseOrder" />}
                        >
                          <PODetailsForm
                            addresses={addresses}
                            change={change}
                            dispatch={dispatch}
                            formValues={formValues}
                            generatedNumber={generatedNumber}
                            order={initialValues}
                            orderNumberSetting={orderNumberSetting}
                            prefixesSetting={prefixesSetting}
                            suffixesSetting={suffixesSetting}
                            stripes={stripes}
                          />
                        </Accordion>
                        {isOngoing(formValues.orderType) && (
                          <Accordion
                            id="ongoing"
                            label={<FormattedMessage id="ui-orders.paneBlock.ongoingInfo" />}
                          >
                            <OngoingInfoForm order={initialValues} ongoingFormValues={formValues.ongoing} />
                          </Accordion>
                        )}
                        <Accordion
                          id="POSummary"
                          label={<FormattedMessage id="ui-orders.paneBlock.POSummary" />}
                        >
                          <SummaryForm {...this.props} />
                        </Accordion>
                      </AccordionSet>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </form>
          </Pane>
        </Paneset>
      </div>
    );
  }
}

export default stripesForm({
  asyncBlurFields: ['poNumber'],
  asyncValidate,
  enableReinitialize: true,
  form: PO_FORM_NAME,
  navigationCheck: true,
})(POForm);
