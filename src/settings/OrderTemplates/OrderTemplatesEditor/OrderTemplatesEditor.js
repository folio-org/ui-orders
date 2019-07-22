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
import { ItemForm } from '../../../components/POLine/Item';
import { CostForm } from '../../../components/POLine/Cost';
import TemplateInformationForm from './TemplateInformationForm';
import PurchaseOrderInformationForm from './PurchaseOrderInformationForm';
import PurchaseOrderRenewalsForm from './PurchaseOrderRenewalsForm';
import PurchaseOrderNotesForm from './PurchaseOrderNotesForm';
import PurchaseOrderSummaryForm from './PurchaseOrderSummaryForm';
import POLineDetailsForm from './POLineDetailsForm';
import POLineVendorForm from './POLineVendorForm';
import POLineFundDistributionForm from './POLineFundDistributionForm';
import POLineEresourcesForm from './POLineEresourcesForm';
import POLinePhysicalForm from './POLinePhysicalForm';
import POLineOtherResourcesForm from './POLineOtherResourcesForm';
import POLineLocationsForm from './POLineLocationsForm';

const ORDER = {};

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
    funds: PropTypes.arrayOf(PropTypes.object),
    createInventorySetting: PropTypes.object,
    prefixesSetting: PropTypes.arrayOf(PropTypes.object),
    suffixesSetting: PropTypes.arrayOf(PropTypes.object),
    addresses: PropTypes.arrayOf(PropTypes.object),
    vendors: PropTypes.arrayOf(PropTypes.object),
    materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.node,
  };

  state = {
    sections: {
      [ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO]: true,
      [ORDER_TEMPLATES_ACCORDION.PO_INFO]: false,
      [ORDER_TEMPLATES_ACCORDION.PO_RENEWALS]: false,
      [ORDER_TEMPLATES_ACCORDION.PO_NOTES]: false,
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
      identifierTypes,
      contributorNameTypes,
      createInventorySetting,
      prefixesSetting,
      suffixesSetting,
      addresses,
      vendors,
      funds,
      locations,
      materialTypes,
      handleSubmit,
      close,
      formValues,
      dispatch,
      change,
      title,
    } = this.props;
    const { sections } = this.state;
    const orderFormat = formValues.orderFormat;

    return (
      <Layer
        contentLabel="Order template editor"
        isOpen
      >
        <form
          id="order-template-form"
          onSubmit={handleSubmit}
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
                      prefixesSetting={prefixesSetting}
                      suffixesSetting={suffixesSetting}
                      addresses={addresses}
                      vendors={vendors}
                      formValues={formValues}
                      change={change}
                      dispatch={dispatch}
                    />
                  </Accordion>

                  {
                    isOngoing(formValues.orderType) && (
                      <Accordion
                        label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_RENEWALS]}
                        id={ORDER_TEMPLATES_ACCORDION.PO_RENEWALS}
                      >
                        <PurchaseOrderRenewalsForm />
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
                      formValues={formValues}
                      change={change}
                      dispatch={dispatch}
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
                    />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_VENDOR]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_VENDOR}
                  >
                    <POLineVendorForm />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION}
                  >
                    <POLineFundDistributionForm
                      formValues={formValues}
                      funds={funds}
                    />
                  </Accordion>

                  {
                    isEresource(orderFormat) && (
                      <Accordion
                        label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES]}
                        id={ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES}
                      >
                        <POLineEresourcesForm
                          materialTypes={materialTypes}
                          vendors={vendors}
                        />
                      </Accordion>
                    )
                  }

                  {
                    isFresource(orderFormat) && (
                      <Accordion
                        label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES]}
                        id={ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES}
                      >
                        <POLinePhysicalForm
                          materialTypes={materialTypes}
                          vendors={vendors}
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
                          vendors={vendors}
                        />
                      </Accordion>
                    )
                  }

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_LOCATION]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_LOCATION}
                  >
                    <POLineLocationsForm locations={locations} />
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
  form: 'orderTemplateForm',
  navigationCheck: true,
})(OrderTemplatesEditor);
