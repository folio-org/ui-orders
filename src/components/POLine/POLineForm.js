import flow from 'lodash/flow';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import keyBy from 'lodash/keyBy';
import pick from 'lodash/pick';
import uniq from 'lodash/uniq';

import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import {
  CUSTOM_FIELDS_ORDERS_BACKEND_NAME,
  Donors,
  FundDistributionFieldsFinal,
  handleKeyCommand,
  IfFieldVisible,
  RECEIPT_STATUS,
  useFunds,
  useInstanceHoldingsQuery,
} from '@folio/stripes-acq-components';
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
  LoadingPane,
  MenuSection,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
  Selection,
} from '@folio/stripes/components';
import {
  stripesShape,
  IfPermission,
} from '@folio/stripes/core';
import stripesForm from '@folio/stripes/final-form';
import {
  EditCustomFieldsRecord,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import {
  ENTITY_TYPE_PO_LINE,
  PO_LINE_CONFIG_NAME_PREFIX,
  POL_FORM_FIELDS,
  SUBMIT_ACTION_FIELD,
} from '../../common/constants';
import {
  useErrorAccordionStatus,
  useFundDistributionValidation,
} from '../../common/hooks';
import {
  isEresource,
  isPhresource,
  isOtherResource,
} from '../../common/POLFields';
import { isOngoing } from '../../common/POFields';
import {
  filterFundsRestrictedByLocations,
  filterHoldingsByRestrictedFunds,
  filterLocationsByRestrictedFunds,
  omitFieldArraysAsyncErrors,
  withUniqueFieldArrayItemKeys,
} from '../../common/utils';
import LocationForm from './Location/LocationForm';
import { EresourcesForm } from './Eresources';
import { PhysicalForm } from './Physical';
import { POLineDetailsForm } from './POLineDetails';
import { VendorForm } from './Vendor';
import { CostForm } from './Cost';
import { ItemForm } from './Item';
import { OtherForm } from './Other';
import { OngoingOrderForm } from './OngoingOrder';
import {
  ACCORDION_ID,
  INITIAL_SECTIONS,
  MAP_FIELD_ACCORDION,
  POL_TEMPLATE_FIELDS_MAP,
  SUBMIT_ACTION,
} from './const';
import getMaterialTypesForSelect from '../Utils/getMaterialTypesForSelect';
import getIdentifierTypesForSelect from '../Utils/getIdentifierTypesForSelect';
import getContributorNameTypesForSelect from '../Utils/getContributorNameTypesForSelect';
import getOrderTemplatesForSelect from '../Utils/getOrderTemplatesForSelect';
import { ifDisabledToChangePaymentInfo } from '../PurchaseOrder/util';
import getOrderTemplateValue from '../Utils/getOrderTemplateValue';
import calculateEstimatedPrice from './calculateEstimatedPrice';
import {
  useExpenseClassChange,
  useManageDonorOrganizationIds,
} from './hooks';
import { createPOLDataFromInstance } from './Item/util';

const GAME_CHANGER_FIELDS = [
  POL_FORM_FIELDS.isPackage,
  POL_FORM_FIELDS.orderFormat,
  POL_FORM_FIELDS.checkinItems,
  POL_FORM_FIELDS.packagePoLineId,
  POL_FORM_FIELDS.instanceId,
];
const GAME_CHANGER_TIMEOUT = 50;

function POLineForm({
  centralOrdering,
  form: { change, batch, getRegisteredFields },
  form,
  initialValues,
  onCancel,
  order,
  parentResources,
  stripes,
  vendor = {},
  pristine,
  submitting,
  handleSubmit,
  isSaveAndOpenButtonVisible,
  values: formValues,
  enableSaveBtn,
  linesLimit,
  locations,
  integrationConfigs = [],
  instance,
  isCreateFromInstance = false,
}) {
  const history = useHistory();

  const [hiddenFields, setHiddenFields] = useState({});
  const [isCustomFieldsLoaded, setIsCustomFieldsLoaded] = useState(false);
  const { validateFundDistributionTotal } = useFundDistributionValidation(formValues);

  const accordionStatusRef = useRef();

  const identifierTypes = getIdentifierTypesForSelect(parentResources);
  const lineId = get(initialValues, 'id');
  const initialDonorOrganizationIds = get(initialValues, POL_FORM_FIELDS.donorOrganizationIds, []);
  const fundDistribution = get(formValues, POL_FORM_FIELDS.fundDistribution, []);
  const lineLocations = get(formValues, POL_FORM_FIELDS.locations, []);
  const instanceId = formValues.instanceId;

  const {
    funds: fundsRecords,
    isLoading: isFundsLoading,
  } = useFunds();

  const fundsMap = useMemo(() => keyBy(fundsRecords, 'id'), [fundsRecords]);

  const {
    donorOrganizationIds,
    onDonorRemove,
    setDonorIds,
  } = useManageDonorOrganizationIds({
    funds: fundsRecords,
    fundDistribution,
    initialDonorOrganizationIds,
  });

  const {
    isLoading: isExpenseClassProcessing,
    renderModal: renderExpenseClassConfirmModal,
    onExpenseClassChange,
  } = useExpenseClassChange(lineId);

  const {
    holdings: instanceHoldings,
    isLoading: isHoldingsLoading,
  } = useInstanceHoldingsQuery(instanceId, { consortium: centralOrdering });

  const shouldUpdateDonorOrganizationIds = useMemo(() => {
    const hasChanged = !isEqual(donorOrganizationIds, formValues?.donorOrganizationIds);
    const isFundDistributionChanged = !isEqual(fundDistribution, initialValues?.fundDistribution);

    return hasChanged && isFundDistributionChanged;
  }, [
    donorOrganizationIds,
    formValues?.donorOrganizationIds,
    fundDistribution,
    initialValues?.fundDistribution,
  ]);

  useEffect(() => {
    if (shouldUpdateDonorOrganizationIds) {
      change(POL_FORM_FIELDS.donorOrganizationIds, donorOrganizationIds);
    }
  }, [change, donorOrganizationIds, shouldUpdateDonorOrganizationIds]);

  const templateValue = useMemo(() => getOrderTemplateValue(parentResources, order?.template, {
    locations,
  }), [locations, order?.template, parentResources]);

  const initialTemplateInventoryData = useMemo(() => (
    !lineId && templateValue.id
      ? {
        ...pick(templateValue, [
          POL_FORM_FIELDS.instanceId,
          POL_FORM_FIELDS.titleOrPackage,
          POL_FORM_FIELDS.publisher,
          POL_FORM_FIELDS.publicationDate,
          POL_FORM_FIELDS.edition,
          POL_FORM_FIELDS.contributors,
          `${POL_FORM_FIELDS.details}.productIds`,
        ]),
      }
      : {}
  ), [lineId, templateValue]);

  const initialInventoryData = useMemo(() => (
    isCreateFromInstance
      ? createPOLDataFromInstance(instance, identifierTypes)
      : initialTemplateInventoryData
  ), [identifierTypes, initialTemplateInventoryData, instance, isCreateFromInstance]);

  const populateFieldsFromTemplate = useCallback((fields) => {
    const setDonorIdsFromTemplate = (donorIds) => {
      setDonorIds((prev) => uniq([...prev, ...donorIds]));
    };

    batch(() => {
      fields.forEach(field => {
        const templateField = POL_TEMPLATE_FIELDS_MAP[field] || field;
        const templateFieldValue = get(templateValue, templateField);

        if (field === POL_FORM_FIELDS.receiptStatus && templateFieldValue === RECEIPT_STATUS.receiptNotRequired) {
          change(POL_FORM_FIELDS.checkinItems, true);
        }

        if (field === POL_FORM_FIELDS.donorOrganizationIds && Array.isArray(templateFieldValue)) {
          change(field, templateFieldValue);
          setDonorIdsFromTemplate(templateFieldValue);
        }

        if (templateFieldValue !== undefined) change(field, templateFieldValue);
      });
    });
  }, [batch, change, setDonorIds, templateValue]);

  const applyInitialInventoryData = useCallback(() => {
    batch(() => {
      change(POL_FORM_FIELDS.isPackage, false);

      Object.keys(initialInventoryData).forEach(field => {
        if (field === 'productIds') {
          change(`${POL_FORM_FIELDS.details}.${field}`, initialInventoryData[field]);
        } else change(field, initialInventoryData[field]);
      });
    });
  }, [batch, change, initialInventoryData]);

  /*
    Populate field values for new PO Line from a template if it exist and custom fields are loaded.
    First, the values of the fields are set, which, when changed, change other fields.
  */

  useEffect(() => {
    if (!lineId && templateValue.id && isCustomFieldsLoaded) {
      setTimeout(() => populateFieldsFromTemplate(GAME_CHANGER_FIELDS));
      setTimeout(() => populateFieldsFromTemplate(getRegisteredFields()), GAME_CHANGER_TIMEOUT);
    }
  }, [populateFieldsFromTemplate, getRegisteredFields, lineId, templateValue, isCustomFieldsLoaded]);

  useEffect(() => {
    if (isCreateFromInstance) {
      setTimeout(() => { applyInitialInventoryData(); }, GAME_CHANGER_TIMEOUT);
    }
  }, [applyInitialInventoryData, isCreateFromInstance]);

  useEffect(() => {
    setHiddenFields(templateValue?.hiddenFields || {});
  }, [templateValue?.hiddenFields]);

  const getAddFirstMenu = () => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-orders.buttons.line.close">
          {([title]) => (
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

  const toggleForceVisibility = () => {
    setHiddenFields(prevHiddenFields => (
      prevHiddenFields
        ? undefined
        : (templateValue?.hiddenFields || {})
    ));
  };

  // eslint-disable-next-line react/prop-types
  const getActionMenu = ({ onToggle }) => (
    Boolean(templateValue?.hiddenFields) && (
      <MenuSection id="po-line-form-actions">
        <IfPermission perm="ui-orders.order.showHidden">
          <Button
            id="clickable-show-hidden"
            data-testid="toggle-fields-visibility"
            buttonStyle="dropdownItem"
            onClick={() => {
              toggleForceVisibility();
              onToggle();
            }}
          >
            <Icon size="small" icon={`eye-${hiddenFields ? 'open' : 'closed'}`}>
              <FormattedMessage id={`ui-orders.order.${hiddenFields ? 'showHidden' : 'hideFields'}`} />
            </Icon>
          </Button>
        </IfPermission>
      </MenuSection>
    )
  );

  const onSaveAndClose = useCallback(() => {
    change(SUBMIT_ACTION_FIELD, SUBMIT_ACTION.saveAndClose);
    handleSubmit();
  }, [change, handleSubmit]);

  const onSaveAndCreateAnother = useCallback(() => {
    change(SUBMIT_ACTION_FIELD, SUBMIT_ACTION.saveAndCreateAnother);
    handleSubmit();
  }, [change, handleSubmit]);

  const onSaveAndOpen = useCallback(() => {
    change(SUBMIT_ACTION_FIELD, SUBMIT_ACTION.saveAndOpen);
    handleSubmit();
  }, [change, handleSubmit]);

  const onSaveAndKeepEditing = useCallback(() => {
    change(SUBMIT_ACTION_FIELD, SUBMIT_ACTION.saveAndKeepEditing);
    handleSubmit();
  }, [change, handleSubmit]);

  const getPaneFooter = () => {
    const isSubmitBtnDisabled = !enableSaveBtn && (
      pristine
      || submitting
      || isExpenseClassProcessing
    );

    const start = (
      <Row>
        <Col xs>
          <Button
            id="clickable-close-new-line-dialog-footer"
            buttonStyle="default mega"
            onClick={onCancel}
          >
            <FormattedMessage id="ui-orders.buttons.line.cancel" />
          </Button>
        </Col>
      </Row>
    );

    const end = (
      <Row>
        <Col xs>
          <Button
            buttonStyle="default mega"
            id="clickable-save-and-keep-editing"
            type="submit"
            disabled={isSubmitBtnDisabled}
            onClick={onSaveAndKeepEditing}
          >
            <FormattedMessage id="stripes-components.saveAndKeepEditing" />
          </Button>
        </Col>

        {!isCreateFromInstance && !lineId && (linesLimit > 1) && (
          <Col xs>
            <Button
              buttonStyle="default mega"
              id="clickable-save-and-create-another"
              type="submit"
              disabled={isSubmitBtnDisabled}
              onClick={onSaveAndCreateAnother}
            >
              <FormattedMessage id="ui-orders.buttons.line.saveAndCreateAnother" />
            </Button>
          </Col>
        )}

        <Col xs>
          <Button
            data-test-button-save
            id="clickable-updatePoLine"
            type="submit"
            buttonStyle={isSaveAndOpenButtonVisible ? 'default mega' : 'primary mega'}
            disabled={isSubmitBtnDisabled}
            onClick={onSaveAndClose}
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
        </Col>

        {isSaveAndOpenButtonVisible && (
          <Col xs>
            <Button
              data-test-button-save-and-open
              data-testid="button-save-and-open"
              type="submit"
              buttonStyle="primary mega"
              disabled={submitting}
              onClick={onSaveAndOpen}
            >
              <FormattedMessage id="ui-orders.buttons.line.saveAndOpen" />
            </Button>
          </Col>
        )}
      </Row>
    );

    return (
      <PaneFooter
        renderStart={start}
        renderEnd={end}
      />
    );
  };

  const formErrors = form.getState()?.errors;
  const errors = useMemo(() => (
    omitFieldArraysAsyncErrors(formErrors, [POL_FORM_FIELDS.fundDistribution])
  ), [formErrors]);
  const errorAccordionStatus = useErrorAccordionStatus({ errors, fieldsMap: MAP_FIELD_ACCORDION });

  const lineNumber = get(initialValues, 'poLineNumber', '');
  const firstMenu = getAddFirstMenu();
  const paneTitle = lineId
    ? <FormattedMessage id="ui-orders.line.paneTitle.edit" values={{ lineNumber }} />
    : <FormattedMessage id="ui-orders.line.paneTitle.new" />;
  const paneFooter = getPaneFooter();

  const changeLocation = (location, locationFieldName, holdingFieldName, holdingId) => {
    const locationId = holdingId ? undefined : location?.id || location;

    change(locationFieldName, locationId);

    if (holdingFieldName) {
      change(holdingFieldName, holdingId);
    }
  };

  const handleCustomFieldsLoaded = () => {
    setIsCustomFieldsLoaded(true);
  };

  const instanceHoldingsMap = useMemo(() => {
    return keyBy(instanceHoldings, 'id');
  }, [instanceHoldings]);

  /*
    Location IDs used in funds validation (location restriction).
  */
  const locationIdsForFunds = useMemo(() => {
    return [
      ...new Set(lineLocations.reduce((acc, { holdingId, locationId }) => {
        const value = holdingId
          ? instanceHoldingsMap[holdingId]?.permanentLocationId
          : locationId;

        if (value) acc.push(value);

        return acc;
      }, [])),
    ];
  }, [instanceHoldingsMap, lineLocations]);

  const lineFunds = useMemo(() => {
    const lineFundsMap = (fundDistribution || []).reduce((acc, { fundId }) => {
      const fund = fundsMap[fundId];

      if (fund) acc[fundId] = fund;

      return acc;
    }, {});

    return Object.values(lineFundsMap);
  }, [fundDistribution, fundsMap]);

  const filterFunds = useCallback((funds) => {
    return filterFundsRestrictedByLocations(locationIdsForFunds, funds);
  }, [locationIdsForFunds]);

  const filterLocations = useCallback((records, includeIds) => {
    return filterLocationsByRestrictedFunds(lineFunds, records, includeIds);
  }, [lineFunds]);

  const filterHoldings = useCallback((records, includeIds) => {
    return filterHoldingsByRestrictedFunds(lineFunds, records, includeIds);
  }, [lineFunds]);

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
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push('/orders/lines')),
    },
  ];

  const isLoading = !initialValues || isFundsLoading;

  if (isLoading) {
    return <LoadingPane defaultWidth="fill" onClose={onCancel} />;
  }

  const orderFormat = get(formValues, POL_FORM_FIELDS.orderFormat);
  const showEresources = isEresource(orderFormat);
  const showPhresources = isPhresource(orderFormat);
  const showOther = isOtherResource(orderFormat);
  const materialTypes = getMaterialTypesForSelect(parentResources);
  const contributorNameTypes = getContributorNameTypesForSelect(parentResources);
  const orderTemplates = getOrderTemplatesForSelect(parentResources);
  const locationIds = locations?.map(({ id }) => id);
  const isDisabledToChangePaymentInfo = ifDisabledToChangePaymentInfo(order);
  const estimatedPrice = calculateEstimatedPrice(formValues);
  const { accounts } = vendor;
  const metadata = get(initialValues, 'metadata');
  const currency = get(formValues, 'cost.currency');
  const customFieldsValues = form.getState().values.customFields;

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <Paneset isRoot>
        <Pane
          id="pane-poLineForm"
          data-test-line-edit
          defaultWidth="fill"
          paneTitle={paneTitle}
          footer={paneFooter}
          onClose={onCancel}
          firstMenu={firstMenu}
          actionMenu={getActionMenu}
        >
          <AccordionStatus ref={accordionStatusRef}>
            {({ status }) => (
              <form id="form-po-line" style={{ height: '100vh' }}>
                <Row>
                  <Col xs={12}>
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
                            <FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.name">
                              {(translatedLabel) => (
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

                      <Col xs={12} md={8} style={{ textAlign: 'left' }}>
                        <AccordionSet
                          initialStatus={INITIAL_SECTIONS}
                          accordionStatus={{ ...status, ...errorAccordionStatus }}
                        >
                          <Accordion
                            label={<FormattedMessage id="ui-orders.line.accordion.itemDetails" />}
                            id={ACCORDION_ID.itemDetails}
                          >
                            {metadata && <ViewMetaData metadata={metadata} />}

                            <ItemForm
                              formValues={formValues}
                              order={order}
                              contributorNameTypes={contributorNameTypes}
                              change={change}
                              batch={batch}
                              identifierTypes={identifierTypes}
                              initialValues={{ ...initialValues, ...initialInventoryData }}
                              stripes={stripes}
                              hiddenFields={hiddenFields}
                              isCreateFromInstance={isCreateFromInstance}
                              lineId={lineId}
                            />
                          </Accordion>
                          <Accordion
                            label={<FormattedMessage id="ui-orders.line.accordion.details" />}
                            id={ACCORDION_ID.lineDetails}
                          >
                            <POLineDetailsForm
                              change={change}
                              formValues={formValues}
                              initialValues={initialValues}
                              order={order}
                              parentResources={parentResources}
                              vendor={vendor}
                              hiddenFields={hiddenFields}
                              integrationConfigs={integrationConfigs}
                            />
                          </Accordion>
                          <IfFieldVisible
                            name="donorOrganizationIds"
                            visible={!hiddenFields?.donorsInformation}
                          >
                            <Accordion
                              id={ACCORDION_ID.donorsInformation}
                              label={<FormattedMessage id="ui-orders.line.accordion.donorInformation" />}
                            >
                              <Donors
                                name="donorOrganizationIds"
                                onChange={setDonorIds}
                                onRemove={onDonorRemove}
                                donorOrganizationIds={donorOrganizationIds}
                              />
                            </Accordion>
                          </IfFieldVisible>
                          {isOngoing(order.orderType) && (
                            <Accordion
                              label={<FormattedMessage id="ui-orders.line.accordion.ongoingOrder" />}
                              id={ACCORDION_ID.ongoingOrder}
                            >
                              <OngoingOrderForm
                                hiddenFields={hiddenFields}
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
                              hiddenFields={hiddenFields}
                              integrationConfigs={integrationConfigs}
                            />
                          </Accordion>
                          <Accordion
                            label={<FormattedMessage id="ui-orders.line.accordion.cost" />}
                            id={ACCORDION_ID.costDetails}
                          >
                            <CostForm
                              formValues={formValues}
                              order={order}
                              initialValues={initialValues}
                              change={change}
                              hiddenFields={hiddenFields}
                            />
                          </Accordion>

                          <IfFieldVisible
                            visible={!hiddenFields?.fundDistribution}
                            name="fundDistribution"
                          >
                            <Accordion
                              label={<FormattedMessage id="ui-orders.line.accordion.fund" />}
                              id={ACCORDION_ID.fundDistribution}
                            >
                              <FundDistributionFieldsFinal
                                change={change}
                                currency={currency}
                                disabled={isDisabledToChangePaymentInfo}
                                filterFunds={filterFunds}
                                fundDistribution={fundDistribution}
                                name="fundDistribution"
                                onExpenseClassChange={onExpenseClassChange}
                                totalAmount={estimatedPrice}
                                validateFundDistributionTotal={validateFundDistributionTotal}
                              />
                            </Accordion>
                          </IfFieldVisible>

                          <IfFieldVisible
                            visible={!hiddenFields?.locations}
                            name="locations"
                          >
                            <Accordion
                              label={<FormattedMessage id="ui-orders.line.accordion.location" />}
                              id={ACCORDION_ID.location}
                            >
                              <LocationForm
                                isLoading={isHoldingsLoading}
                                centralOrdering={centralOrdering}
                                changeLocation={changeLocation}
                                formValues={formValues}
                                filterHoldings={filterHoldings}
                                filterLocations={filterLocations}
                                locationIds={locationIds}
                                locations={locations}
                                order={order}
                              />
                            </Accordion>
                          </IfFieldVisible>

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
                                hiddenFields={hiddenFields}
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
                                hiddenFields={hiddenFields}
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
                                hiddenFields={hiddenFields}
                              />
                            </Accordion>
                          )}

                          <IfFieldVisible visible={!hiddenFields?.customPOLineFields}>
                            <EditCustomFieldsRecord
                              accordionId="customFieldsPOLine"
                              backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
                              changeFinalFormField={change}
                              entityType={ENTITY_TYPE_PO_LINE}
                              fieldComponent={Field}
                              finalFormCustomFieldsValues={customFieldsValues}
                              configNamePrefix={PO_LINE_CONFIG_NAME_PREFIX}
                              onComponentLoad={handleCustomFieldsLoaded}
                            />
                          </IfFieldVisible>
                        </AccordionSet>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {renderExpenseClassConfirmModal()}
              </form>
            )}
          </AccordionStatus>
        </Pane>
      </Paneset>
    </HasCommand>
  );
}

POLineForm.propTypes = {
  centralOrdering: PropTypes.bool,
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  stripes: stripesShape.isRequired,
  onCancel: PropTypes.func,
  order: PropTypes.object.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  parentResources: PropTypes.object,
  form: PropTypes.object.isRequired,
  vendor: PropTypes.object,
  isSaveAndOpenButtonVisible: PropTypes.bool,
  values: PropTypes.object.isRequired,
  enableSaveBtn: PropTypes.bool,
  linesLimit: PropTypes.number.isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    institutionId: PropTypes.string.isRequired,
    campusId: PropTypes.string.isRequired,
    libraryId: PropTypes.string.isRequired,
    tenantId: PropTypes.string,
  })).isRequired,
  integrationConfigs: PropTypes.arrayOf(PropTypes.object),
  instance: PropTypes.object,
  isCreateFromInstance: PropTypes.bool,
};

export default flow(
  stripesForm({
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    navigationCheck: true,
    validateOnBlur: true,
    subscription: { values: true },
  }),
  withUniqueFieldArrayItemKeys,
)(POLineForm);
