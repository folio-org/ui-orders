import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  getFormSyncErrors,
  getFormValues,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  LoadingPane,
  IconButton,
  Pane,
  PaneMenu,
  PaneFooter,
  Selection,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import stripesForm from '@folio/stripes/form';
import {
  FundDistributionFields,
} from '@folio/stripes-acq-components';

import {
  isEresource,
  isFresource,
  isOtherResource,
} from '../../common/POLFields';
import LocationForm from './Location/LocationForm';
import { EresourcesForm } from './Eresources';
import { PhysicalForm } from './Physical';
import { POLineDetailsForm } from './POLineDetails';
import { VendorForm } from './Vendor';
import { CostForm } from './Cost';
import { ItemForm } from './Item';
import { OtherForm } from './Other';
import {
  ACCORDION_ID,
  MAP_FIELD_ACCORDION,
} from './const';
import getMaterialTypesForSelect from '../Utils/getMaterialTypesForSelect';
import getIdentifierTypesForSelect from '../Utils/getIdentifierTypesForSelect';
import getContributorNameTypesForSelect from '../Utils/getContributorNameTypesForSelect';
import getOrderTemplatesForSelect from '../Utils/getOrderTemplatesForSelect';
import { ifDisabledToChangePaymentInfo } from '../PurchaseOrder/util';
import calculateEstimatedPrice from './calculateEstimatedPrice';
import asyncValidate from './asyncValidate';
import validate from './validate';

class POLineForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    stripes: stripesShape.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    order: PropTypes.object.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.object,
    change: PropTypes.func,
    dispatch: PropTypes.func,
    vendor: PropTypes.object,
    isSaveAndOpenButtonVisible: PropTypes.bool,
    enableSaveBtn: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      sections: {
        [ACCORDION_ID.lineDetails]: true,
        [ACCORDION_ID.costDetails]: true,
        [ACCORDION_ID.vendor]: true,
        [ACCORDION_ID.eresources]: true,
        [ACCORDION_ID.itemDetails]: true,
        [ACCORDION_ID.other]: true,
        [ACCORDION_ID.physical]: true,
        [ACCORDION_ID.fundDistribution]: true,
        [ACCORDION_ID.location]: true,
      },
    };
  }

  static getDerivedStateFromProps({ stripes: { store } }, { sections }) {
    const errorKeys = Object.keys(getFormSyncErrors('POLineForm')(store.getState()));

    if (errorKeys.length > 0) {
      const newSections = { ...sections };

      errorKeys.forEach(key => {
        const accordionName = MAP_FIELD_ACCORDION[key];

        if (accordionName) {
          newSections[accordionName] = true;
        }
      });

      return { sections: newSections };
    }

    return null;
  }

  getAddFirstMenu = () => {
    const { onCancel } = this.props;

    return (
      <PaneMenu>
        <FormattedMessage id="ui-orders.buttons.line.close">
          {(title) => (
            <IconButton
              ariaLabel={title}
              icon="times"
              id="clickable-close-new-line-dialog"
              onClick={onCancel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  };

  getPaneFooter() {
    const {
      pristine,
      submitting,
      handleSubmit,
      onCancel,
      isSaveAndOpenButtonVisible,
      onSubmit,
      enableSaveBtn,
    } = this.props;

    const start = (
      <FormattedMessage id="ui-orders.buttons.line.cancel">
        {(btnLabel) => (
          <Button
            id="clickable-close-new-line-dialog-footer"
            buttonStyle="default mega"
            onClick={onCancel}
          >
            {btnLabel}
          </Button>
        )}
      </FormattedMessage>
    );

    const buttonSaveStyle = isSaveAndOpenButtonVisible ? 'default mega' : 'primary mega';

    const end = (
      <Fragment>
        <Button
          data-test-button-save
          id="clickable-updatePoLine"
          type="submit"
          buttonStyle={buttonSaveStyle}
          disabled={!enableSaveBtn && (pristine || submitting)}
          onClick={handleSubmit}
        >
          <FormattedMessage id="ui-orders.buttons.line.save" />
        </Button>
        {isSaveAndOpenButtonVisible && (
          <Button
            data-test-button-save-and-open
            type="submit"
            buttonStyle="primary mega"
            disabled={submitting}
            onClick={handleSubmit(values => onSubmit({ ...values, saveAndOpen: true }))}
          >
            <FormattedMessage id="ui-orders.buttons.line.saveAndOpen" />
          </Button>
        )}
      </Fragment>
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
  };

  handleExpandAll = (sections) => {
    this.setState({ sections });
  };

  changeLocation = (name, id) => {
    const { change, dispatch } = this.props;

    dispatch(change(name, id));
  };

  render() {
    const {
      change,
      dispatch,
      initialValues,
      onCancel,
      order,
      parentResources,
      stripes,
      vendor = {},
    } = this.props;
    const { store } = stripes;
    const lineId = get(initialValues, 'id');
    const lineNumber = get(initialValues, 'poLineNumber', '');
    const firstMenu = this.getAddFirstMenu();
    const paneTitle = lineId
      ? <FormattedMessage id="ui-orders.line.paneTitle.edit" values={{ lineNumber }} />
      : <FormattedMessage id="ui-orders.line.paneTitle.new" />;
    const paneFooter = this.getPaneFooter();

    if (!initialValues) {
      return <LoadingPane defaultWidth="fill" onClose={onCancel} />;
    }

    const formValues = getFormValues('POLineForm')(store.getState());
    const orderFormat = get(formValues, 'orderFormat');
    const showEresources = isEresource(orderFormat);
    const showPhresources = isFresource(orderFormat);
    const showOther = isOtherResource(orderFormat);
    const materialTypes = getMaterialTypesForSelect(parentResources);
    const identifierTypes = getIdentifierTypesForSelect(parentResources);
    const contributorNameTypes = getContributorNameTypesForSelect(parentResources);
    const orderTemplates = getOrderTemplatesForSelect(parentResources);
    const locations = parentResources?.locations?.records;
    const locationIds = locations?.map(({ id }) => id);
    const isDisabledToChangePaymentInfo = ifDisabledToChangePaymentInfo(order);
    const estimatedPrice = calculateEstimatedPrice(formValues, stripes.currency);
    const { accounts } = vendor;
    const fundDistribution = get(formValues, 'fundDistribution');
    const vendorRefNumberType = get(formValues, 'vendorDetail.refNumberType');
    const vendorRefNumber = get(formValues, 'vendorDetail.refNumber');
    const metadata = get(initialValues, 'metadata');
    const currency = get(formValues, 'cost.currency');
    const isPackage = get(formValues, 'isPackage');

    return (
      <Pane
        id="pane-poLineForm"
        data-test-line-edit
        defaultWidth="fill"
        paneTitle={paneTitle}
        footer={paneFooter}
        onClose={onCancel}
        firstMenu={firstMenu}
      >
        <form id="form-po-line" style={{ height: '100vh' }}>
          <Row>
            <Col xs={12}>
              <Row center="xs">
                <Col xs={12} md={8}>
                  <Row end="xs">
                    <Col xs={12}>
                      <ExpandAllButton
                        accordionStatus={this.state.sections}
                        onToggle={this.handleExpandAll}
                      />
                    </Col>
                  </Row>
                </Col>

                {!initialValues.id && (
                  <Col xs={12} md={8}>
                    <Row>
                      <Col xs={4}>
                        <FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.name">
                          {translatedLabel => (
                            <Selection
                              dataOptions={orderTemplates}
                              label={translatedLabel}
                              value={order.template}
                              disabled
                            />
                          )}
                        </FormattedMessage>
                      </Col>
                    </Row>
                  </Col>
                )}

                <Col xs={12} md={8} style={{ textAlign: 'left' }}>
                  <AccordionSet
                    accordionStatus={this.state.sections}
                    onToggle={this.onToggleSection}
                  >
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.itemDetails" />}
                      id={ACCORDION_ID.itemDetails}
                    >
                      {metadata && <ViewMetaData metadata={metadata} />}

                      <ItemForm
                        formName="POLineForm"
                        formValues={formValues}
                        order={order}
                        contributorNameTypes={contributorNameTypes}
                        change={change}
                        dispatch={dispatch}
                        identifierTypes={identifierTypes}
                        initialValues={initialValues}
                        stripes={stripes}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.details" />}
                      id={ACCORDION_ID.lineDetails}
                    >
                      <POLineDetailsForm
                        change={change}
                        dispatch={dispatch}
                        formValues={formValues}
                        initialValues={initialValues}
                        order={order}
                        parentResources={parentResources}
                        vendor={vendor}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.cost" />}
                      id={ACCORDION_ID.costDetails}
                    >
                      <CostForm
                        change={change}
                        dispatch={dispatch}
                        formValues={formValues}
                        order={order}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.fund" />}
                      id={ACCORDION_ID.fundDistribution}
                    >
                      <FundDistributionFields
                        currency={currency}
                        formName="POLineForm"
                        fundDistribution={fundDistribution}
                        name="fundDistribution"
                        disabled={isDisabledToChangePaymentInfo}
                        totalAmount={estimatedPrice}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.location" />}
                      id={ACCORDION_ID.location}
                    >
                      <LocationForm
                        changeLocation={this.changeLocation}
                        formValues={formValues}
                        isPackage={isPackage}
                        locationIds={locationIds}
                        locations={locations}
                        order={order}
                      />
                    </Accordion>
                    {showPhresources && (
                      <Accordion
                        label={<FormattedMessage id="ui-orders.line.accordion.physical" />}
                        id={ACCORDION_ID.physical}
                      >
                        <PhysicalForm
                          materialTypes={materialTypes}
                          order={order}
                          formValues={formValues}
                          change={change}
                          dispatch={dispatch}
                        />
                      </Accordion>
                    )}
                    {showEresources && (
                      <Accordion
                        label={<FormattedMessage id="ui-orders.line.accordion.eresource" />}
                        id={ACCORDION_ID.eresources}
                      >
                        <EresourcesForm
                          materialTypes={materialTypes}
                          order={order}
                          formValues={formValues}
                          change={change}
                          dispatch={dispatch}
                        />
                      </Accordion>
                    )}
                    {showOther && (
                      <Accordion
                        label={<FormattedMessage id="ui-orders.line.accordion.other" />}
                        id={ACCORDION_ID.other}
                      >
                        <OtherForm
                          materialTypes={materialTypes}
                          order={order}
                          formValues={formValues}
                          change={change}
                          dispatch={dispatch}
                        />
                      </Accordion>
                    )}
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.vendor" />}
                      id={ACCORDION_ID.vendor}
                    >
                      <VendorForm
                        accounts={accounts}
                        order={order}
                        vendorRefNumber={vendorRefNumber}
                        vendorRefNumberType={vendorRefNumberType}
                      />
                    </Accordion>
                  </AccordionSet>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      </Pane>
    );
  }
}

export default stripesForm({
  asyncValidate,
  asyncBlurFields: ['details.productIds[].productId', 'details.productIds[].productIdType'],
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  form: 'POLineForm',
  navigationCheck: true,
  validate,
})(POLineForm);
