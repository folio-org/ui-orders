import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Layer,
  ExpandAllButton,
  Row,
  Col,
  AccordionSet,
  Accordion,
  PaneMenu,
  Button,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import {
  FundDistributionFields,
  FieldTags,
} from '@folio/stripes-acq-components';

import {
  ORDER_TEMPLATES_ACCORDION,
  ORDER_TEMPLATES_ACCORDION_TITLES,
} from '../constants';

import {
  isEresource,
  isFresource,
  isOtherResource,
} from '../../../common/POLFields';
import {
  isOngoing,
} from '../../../common/POFields';
import { WORKFLOW_STATUS } from '../../../common/constants';
import { ItemForm } from '../../../components/POLine/Item';
import { CostForm } from '../../../components/POLine/Cost';
import TemplateInformationForm from './TemplateInformationForm';
import PurchaseOrderInformationForm from './PurchaseOrderInformationForm';
import { OngoingInfoForm } from '../../../components/PurchaseOrder/OngoingOgderInfo';
import PurchaseOrderNotesForm from './PurchaseOrderNotesForm';
import PurchaseOrderSummaryForm from './PurchaseOrderSummaryForm';
import POLineDetailsForm from './POLineDetailsForm';
import POLineVendorForm from './POLineVendorForm';
import POLineEresourcesForm from './POLineEresourcesForm';
import POLinePhysicalForm from './POLinePhysicalForm';
import POLineOtherResourcesForm from './POLineOtherResourcesForm';
import POLineLocationsForm from './POLineLocationsForm';
import calculateEstimatedPrice from '../../../components/POLine/calculateEstimatedPrice';

import css from './OrderTemplatesEditor.css';

const ORDER = {
  workflowStatus: WORKFLOW_STATUS.pending,
};

const ORDER_TEMPLATES_FORM_NAME = 'orderTemplateForm';

class OrderTemplatesEditor extends Component {
  static propTypes = {
    formValues: PropTypes.object.isRequired,
    change: PropTypes.func,
    dispatch: PropTypes.func,
    close: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    identifierTypes: PropTypes.arrayOf(PropTypes.object),
    contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
    locations: PropTypes.arrayOf(PropTypes.object),
    createInventorySetting: PropTypes.object,
    prefixesSetting: PropTypes.arrayOf(PropTypes.object),
    suffixesSetting: PropTypes.arrayOf(PropTypes.object),
    addresses: PropTypes.arrayOf(PropTypes.object),
    materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.node,
    accounts: PropTypes.arrayOf(PropTypes.object),
    initialValues: PropTypes.object,
    stripes: PropTypes.object.isRequired,
  };

  state = {
    sections: {
      [ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO]: true,
      [ORDER_TEMPLATES_ACCORDION.PO_INFO]: false,
      [ORDER_TEMPLATES_ACCORDION.PO_ONGOING]: false,
      [ORDER_TEMPLATES_ACCORDION.PO_NOTES]: false,
      [ORDER_TEMPLATES_ACCORDION.PO_TAGS]: false,
      [ORDER_TEMPLATES_ACCORDION.PO_SUMMARY]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_DETAILS]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_VENDOR]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_OTHER_RESOURCES]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_LOCATION]: false,
      [ORDER_TEMPLATES_ACCORDION.POL_TAGS]: false,
    },
  };

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

  getLastMenu() {
    const { pristine, submitting } = this.props;

    return (
      <PaneMenu>
        <FormattedMessage id="ui-orders.settings.orderTemplates.editor.save">
          {ariaLabel => (
            <Button
              id="save-order-template-button"
              type="submit"
              disabled={pristine || submitting}
              style={{ marginBottom: '0', marginRight: '10px' }}
            >
              {ariaLabel}
            </Button>
          )}
        </FormattedMessage>

      </PaneMenu>
    );
  }

  render() {
    const {
      initialValues,
      identifierTypes,
      contributorNameTypes,
      createInventorySetting,
      prefixesSetting,
      suffixesSetting,
      addresses,
      locations,
      materialTypes,
      handleSubmit,
      close,
      formValues,
      dispatch,
      change,
      title,
      accounts,
      stripes,
    } = this.props;
    const { sections } = this.state;
    const orderFormat = formValues.orderFormat;
    const estimatedPrice = calculateEstimatedPrice(formValues, stripes.currency);
    const fundDistribution = formValues.fundDistribution || [];

    return (
      <Layer
        contentLabel="Order template editor"
        isOpen
      >
        <form
          id="order-template-form"
          onSubmit={handleSubmit}
          className={css.orderTemplatesEditor}
        >
          <Pane
            id="order-settings-order-templates-editor"
            defaultWidth="fill"
            paneTitle={title}
            dismissible
            onClose={close}
            lastMenu={this.getLastMenu()}
          >
            <Row center="xs">
              <Col xs={12} md={8}>
                <Row end="xs">
                  <Col xs={12}>
                    <ExpandAllButton
                      accordionStatus={sections}
                      onToggle={this.handleExpandAll}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row center="xs">
              <Col xs={12} md={8}>
                <AccordionSet
                  accordionStatus={sections}
                  onToggle={this.onToggleSection}
                >
                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO]}
                    id={ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO}
                  >
                    <TemplateInformationForm />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_INFO]}
                    id={ORDER_TEMPLATES_ACCORDION.PO_INFO}
                  >
                    <PurchaseOrderInformationForm
                      acqUnitIds={initialValues.acqUnitIds || []}
                      prefixesSetting={prefixesSetting}
                      suffixesSetting={suffixesSetting}
                      addresses={addresses}
                      formValues={formValues}
                      change={change}
                      dispatch={dispatch}
                    />
                  </Accordion>

                  {
                    isOngoing(formValues.orderType) && (
                      <Accordion
                        label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_ONGOING]}
                        id={ORDER_TEMPLATES_ACCORDION.PO_ONGOING}
                      >
                        <OngoingInfoForm ongoingFormValues={formValues.ongoing} />
                      </Accordion>
                    )
                  }

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_NOTES]}
                    id={ORDER_TEMPLATES_ACCORDION.PO_NOTES}
                  >
                    <PurchaseOrderNotesForm />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_TAGS]}
                    id={ORDER_TEMPLATES_ACCORDION.PO_TAGS}
                  >
                    <Row>
                      <Col xs={3}>
                        <FieldTags
                          formName={ORDER_TEMPLATES_FORM_NAME}
                          name="poTags.tagList"
                        />
                      </Col>
                    </Row>
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_SUMMARY]}
                    id={ORDER_TEMPLATES_ACCORDION.PO_SUMMARY}
                  >
                    <PurchaseOrderSummaryForm />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS}
                  >
                    <ItemForm
                      identifierTypes={identifierTypes}
                      contributorNameTypes={contributorNameTypes}
                      order={ORDER}
                      formName={ORDER_TEMPLATES_FORM_NAME}
                      formValues={formValues}
                      change={change}
                      dispatch={dispatch}
                      required={false}
                      stripes={stripes}
                    />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_DETAILS]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_DETAILS}
                  >
                    <POLineDetailsForm
                      change={change}
                      dispatch={dispatch}
                      formValues={formValues}
                      createInventorySetting={createInventorySetting}
                    />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS}
                  >
                    <CostForm
                      change={change}
                      dispatch={dispatch}
                      formValues={formValues}
                      order={ORDER}
                      required={false}
                    />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION}
                  >
                    <FundDistributionFields
                      fundDistribution={fundDistribution}
                      name="fundDistribution"
                      totalAmount={estimatedPrice}
                      required={false}
                    />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_LOCATION]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_LOCATION}
                  >
                    <POLineLocationsForm locations={locations} />
                  </Accordion>

                  {
                    isFresource(orderFormat) && (
                      <Accordion
                        label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES]}
                        id={ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES}
                      >
                        <POLinePhysicalForm
                          materialTypes={materialTypes}
                          change={change}
                          dispatch={dispatch}
                          formValues={formValues}
                        />
                      </Accordion>
                    )
                  }

                  {
                    isEresource(orderFormat) && (
                      <Accordion
                        label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES]}
                        id={ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES}
                      >
                        <POLineEresourcesForm
                          materialTypes={materialTypes}
                          change={change}
                          dispatch={dispatch}
                          formValues={formValues}
                        />
                      </Accordion>
                    )
                  }

                  {
                    isOtherResource(orderFormat) && (
                      <Accordion
                        label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_OTHER_RESOURCES]}
                        id={ORDER_TEMPLATES_ACCORDION.POL_OTHER_RESOURCES}
                      >
                        <POLineOtherResourcesForm
                          materialTypes={materialTypes}
                          change={change}
                          dispatch={dispatch}
                          formValues={formValues}
                        />
                      </Accordion>
                    )
                  }

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_VENDOR]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_VENDOR}
                  >
                    <POLineVendorForm accounts={accounts} />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_TAGS]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_TAGS}
                  >
                    <Row>
                      <Col xs={3}>
                        <FieldTags
                          formName={ORDER_TEMPLATES_FORM_NAME}
                          name="polTags.tagList"
                        />
                      </Col>
                    </Row>
                  </Accordion>
                </AccordionSet>
              </Col>
            </Row>
          </Pane>
        </form>
      </Layer>
    );
  }
}

export default stripesForm({
  enableReinitialize: true,
  form: ORDER_TEMPLATES_FORM_NAME,
  navigationCheck: true,
})(OrderTemplatesEditor);
