import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { mapValues } from 'lodash';

import {
  Accordion,
  AccordionSet,
  Button,
  checkScope,
  Col,
  ExpandAllButton,
  HasCommand,
  Layer,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/final-form';
import {
  FundDistributionFieldsFinal,
  FieldTags,
  handleKeyCommand,
  useAccordionToggle,
} from '@folio/stripes-acq-components';

import {
  INITIAL_SECTIONS,
  MAP_FIELD_ACCORDION,
  ORDER_TEMPLATES_ACCORDION,
  ORDER_TEMPLATES_ACCORDION_TITLES,
} from '../constants';

import { isOngoing } from '../../../common/POFields';
import {
  isEresource,
  isPhresource,
  isOtherResource,
} from '../../../common/POLFields';
import { WORKFLOW_STATUS } from '../../../common/constants';
import { useFundDistributionValidation } from '../../../common/hooks';
import { ItemForm } from '../../../components/POLine/Item';
import { CostForm } from '../../../components/POLine/Cost';
import { OngoingOrderForm } from '../../../components/POLine/OngoingOrder';
import TemplateInformationForm from './TemplateInformationForm';
import PurchaseOrderInformationForm from './PurchaseOrderInformationForm';
import { OngoingInfoForm } from '../../../components/PurchaseOrder/OngoingOrderInfo';
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

const OrderTemplatesEditor = ({
  initialValues,
  identifierTypes,
  contributorNameTypes,
  createInventorySetting,
  prefixesSetting,
  suffixesSetting,
  addresses,
  locationIds,
  locations,
  materialTypes,
  handleSubmit,
  close,
  values: formValues,
  form: { change, batch, getState },
  title,
  vendors,
  stripes,
  pristine,
  submitting,
}) => {
  const { validateFundDistributionTotal } = useFundDistributionValidation(formValues);
  const errors = getState()?.errors;

  const [
    expandAll,
    stateSections,
    toggleSection,
  ] = useAccordionToggle(
    INITIAL_SECTIONS,
    {
      errors,
      fieldsMap: MAP_FIELD_ACCORDION,
    },
  );

  const changeLocation = (location, locationFieldName, holdingFieldName, holdingId) => {
    const locationId = holdingId ? undefined : location?.id || location;

    change(locationFieldName, locationId);

    if (holdingFieldName) {
      change(holdingFieldName, holdingId);
    }
  };

  const getLastMenu = () => {
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
  };

  const {
    cost,
    fundDistribution = [],
    orderFormat,
    orderType,
  } = formValues;

  const estimatedPrice = calculateEstimatedPrice(formValues);
  const currency = cost?.currency || stripes.currency;
  const vendor = vendors?.find(v => v.id === formValues.vendor);
  const accounts = vendor?.accounts.map(({ name, accountNo }) => ({
    label: `${name} (${accountNo})`,
    value: accountNo,
  }));

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(close),
    },
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
    {
      name: 'expandAllSections',
      handler: () => expandAll(mapValues(stateSections, () => true)),
    },
    {
      name: 'collapseAllSections',
      handler: () => expandAll(mapValues(stateSections, () => false)),
    },
  ];

  return (
    <Layer
      contentLabel="Order template editor"
      isOpen
    >
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
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
            lastMenu={getLastMenu()}
          >
            <Row center="xs">
              <Col xs={12} md={8}>
                <Row end="xs">
                  <Col xs={12}>
                    <ExpandAllButton
                      accordionStatus={stateSections}
                      onToggle={expandAll}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row center="xs">
              <Col xs={12} md={8} style={{ textAlign: 'left' }}>
                <AccordionSet
                  accordionStatus={stateSections}
                  onToggle={toggleSection}
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
                    />
                  </Accordion>

                  <OngoingInfoForm />

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
                          change={change}
                          formValues={formValues}
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
                      formValues={formValues}
                      change={change}
                      batch={batch}
                      required={false}
                      stripes={stripes}
                    />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_DETAILS]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_DETAILS}
                  >
                    <POLineDetailsForm
                      formValues={formValues}
                      createInventorySetting={createInventorySetting}
                    />
                  </Accordion>

                  {isOngoing(orderType) && (
                    <Accordion
                      label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_ONGOING_ORDER]}
                      id={ORDER_TEMPLATES_ACCORDION.POL_ONGOING_ORDER}
                    >
                      <OngoingOrderForm />
                    </Accordion>
                  )}

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_VENDOR]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_VENDOR}
                  >
                    <POLineVendorForm accounts={accounts} />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS}
                  >
                    <CostForm
                      formValues={formValues}
                      order={ORDER}
                      required={false}
                      initialValues={initialValues}
                      change={change}
                    />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION}
                  >
                    <FundDistributionFieldsFinal
                      change={change}
                      currency={currency}
                      fundDistribution={fundDistribution}
                      name="fundDistribution"
                      totalAmount={estimatedPrice}
                      required={false}
                      validateFundDistributionTotal={validateFundDistributionTotal}
                    />
                  </Accordion>

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_LOCATION]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_LOCATION}
                  >
                    <POLineLocationsForm
                      changeLocation={changeLocation}
                      locationIds={locationIds}
                      locations={locations}
                      formValues={formValues}
                    />
                  </Accordion>

                  {
                    isPhresource(orderFormat) && (
                      <Accordion
                        label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES]}
                        id={ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES}
                      >
                        <POLinePhysicalForm
                          materialTypes={materialTypes}
                          change={change}
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
                          formValues={formValues}
                        />
                      </Accordion>
                    )
                  }

                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_TAGS]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_TAGS}
                  >
                    <Row>
                      <Col xs={3}>
                        <FieldTags
                          change={change}
                          formValues={formValues}
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
      </HasCommand>
    </Layer>
  );
};

OrderTemplatesEditor.propTypes = {
  values: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  createInventorySetting: PropTypes.object,
  prefixesSetting: PropTypes.arrayOf(PropTypes.object),
  suffixesSetting: PropTypes.arrayOf(PropTypes.object),
  addresses: PropTypes.arrayOf(PropTypes.object),
  materialTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.node,
  vendors: PropTypes.arrayOf(PropTypes.object),
  initialValues: PropTypes.object,
  stripes: PropTypes.object.isRequired,
};

export default stripesForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  validateOnBlur: true,
  subscription: { values: true },
})(OrderTemplatesEditor);
