import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  getFormValues,
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
  Paneset,
  Row,
} from '@folio/stripes/components';
import { FieldSelection } from '@folio/stripes-acq-components';

import {
  getAddresses,
  getSettingsList,
} from '../../common/utils';
import { isOngoing } from '../../common/POFields';
import getOrderNumberSetting from '../../common/utils/getOrderNumberSetting';
import getOrderTemplatesForSelect from '../Utils/getOrderTemplatesForSelect';
import { PODetailsForm } from './PODetails';
import { SummaryForm } from './Summary';
import { RenewalsForm } from './renewals';
import { ORGANIZATION_STATUS_ACTIVE } from '../../common/constants';
import getOrderTemplateValue from '../Utils/getOrderTemplateValue';

const throwError = () => {
  const errorInfo = { poNumber: <FormattedMessage id="ui-orders.errors.orderNumberIsNotValid" /> };

  throw errorInfo;
};

const asyncValidate = (values, dispatchRedux, props) => {
  const { poNumber, numberPrefix = '', numberSuffix = '' } = values;
  const fullOrderNumber = `${numberPrefix}${poNumber}${numberSuffix}`.trim();
  const { parentMutator: { orderNumber: validator }, stripes: { store } } = props;
  const orderNumberFieldIsDirty = isDirty('FormPO')(store.getState(), ['poNumber']);

  return orderNumberFieldIsDirty && poNumber
    ? validator.POST({ poNumber: fullOrderNumber })
      .catch(response => response.json()
        .catch(() => throwError())
        .then(() => throwError()))
    : Promise.resolve();
};

class POForm extends Component {
  static propTypes = {
    connectedSource: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
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

  componentDidMount() {
    const { initialValues: { id }, change, dispatch, parentMutator } = this.props;

    parentMutator.orderNumber.reset();
    parentMutator.orderNumber.GET()
      .then(({ poNumber: orderNumber }) => {
        if (!id) {
          dispatch(change('poNumber', orderNumber));
        }
      });
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

  getLastMenu(id, label) {
    const { pristine, submitting, handleSubmit } = this.props;

    return (
      <PaneMenu>
        <FormattedMessage id={label}>
          {ariaLabel => (
            <Button
              id={id}
              type="submit"
              disabled={pristine || submitting}
              onClick={handleSubmit}
              style={{ marginBottom: '0', marginRight: '10px' }}
            >
              {ariaLabel}
            </Button>
          )}
        </FormattedMessage>

      </PaneMenu>
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

    if (templateValue) {
      const { form: { FormPO } } = stripes.store.getState();
      const { registeredFields } = FormPO;

      dispatch(change('template', value));
      Object.keys(registeredFields)
        .forEach(field => get(templateValue, field) && dispatch(change(field, get(templateValue, field))));
    }
  };

  render() {
    const { change, dispatch, initialValues, onCancel, stripes, parentResources } = this.props;
    const { sections } = this.state;
    const generatedNumber = get(parentResources, 'orderNumber.records.0.poNumber');
    const formValues = getFormValues('FormPO')(stripes.store.getState());
    const firstMenu = this.getAddFirstMenu();
    const orderNumber = get(initialValues, 'poNumber', '');
    const paneTitle = initialValues.id
      ? <FormattedMessage id="ui-orders.order.paneTitle.edit" values={{ orderNumber }} />
      : <FormattedMessage id="ui-orders.paneMenu.createPurchaseOrder" />;
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-update-purchase-order', 'ui-orders.paneMenu.saveOrder') :
      this.getLastMenu('clickable-create-new-purchase-order', 'ui-orders.paneMenu.saveOrder');
    const orderNumberSetting = getOrderNumberSetting(get(parentResources, 'orderNumberSetting.records', {}));
    const prefixesSetting = getSettingsList(get(parentResources, 'prefixesSetting.records', {}));
    const suffixesSetting = getSettingsList(get(parentResources, 'suffixesSetting.records', {}));
    const addresses = getAddresses(get(parentResources, 'addresses.records', []));
    const vendors = get(parentResources, 'vendors.records', [])
      .filter(vendor => vendor.isVendor && vendor.status === ORGANIZATION_STATUS_ACTIVE);
    const orderTemplates = getOrderTemplatesForSelect(parentResources);

    if (!initialValues) {
      return (
        <Pane
          defaultWidth="fill"
          firstMenu={firstMenu}
          id="pane-podetails"
          lastMenu={lastMenu}
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
            lastMenu={lastMenu}
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

                    {!initialValues.id && (
                      <Col xs={12} md={8}>
                        <Row>
                          <Col xs={4}>
                            <FieldSelection
                              dataOptions={orderTemplates}
                              onChange={this.onChangeTemplate}
                              label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.name" />}
                              name="template"
                            />
                          </Col>
                        </Row>
                      </Col>
                    )}

                    <Col xs={12} md={8} style={{ textAlign: 'left' }}>
                      <AccordionSet accordionStatus={sections} onToggle={this.onToggleSectiFon}>
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
                            vendors={vendors}
                          />
                        </Accordion>
                        {isOngoing(formValues.orderType) && (
                          <Accordion
                            id="renewals"
                            label={<FormattedMessage id="ui-orders.paneBlock.renewals" />}
                          >
                            <RenewalsForm order={initialValues} />
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
  form: 'FormPO',
  navigationCheck: true,
})(POForm);
