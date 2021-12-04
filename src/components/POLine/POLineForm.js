import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get, mapValues, pick } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import { stripesShape, IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Button,
  Checkbox,
  checkScope,
  Col,
  ExpandAllButton,
  HasCommand,
  IconButton,
  InfoPopover,
  LoadingPane,
  Pane,
  PaneFooter,
  PaneMenu,
  Row,
  Selection,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import stripesForm from '@folio/stripes/final-form';
import {
  FundDistributionFieldsFinal,
  handleKeyCommand,
  useAccordionToggle,
} from '@folio/stripes-acq-components';

import {
  isEresource,
  isPhresource,
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
  INITIAL_SECTIONS,
  MAP_FIELD_ACCORDION,
  POL_TEMPLATE_FIELDS_MAP,
} from './const';
import getMaterialTypesForSelect from '../Utils/getMaterialTypesForSelect';
import getIdentifierTypesForSelect from '../Utils/getIdentifierTypesForSelect';
import getContributorNameTypesForSelect from '../Utils/getContributorNameTypesForSelect';
import getOrderTemplatesForSelect from '../Utils/getOrderTemplatesForSelect';
import { ifDisabledToChangePaymentInfo } from '../PurchaseOrder/util';
import getOrderTemplateValue from '../Utils/getOrderTemplateValue';
import calculateEstimatedPrice from './calculateEstimatedPrice';
import styles from './POLineForm.css';

const GAME_CHANGER_FIELDS = ['isPackage', 'orderFormat', 'checkinItems', 'packagePoLineId', 'instanceId'];

function POLineForm({
  form: { change, batch },
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
  isCreateAnotherChecked = false,
  toggleCreateAnother,
}) {
  const history = useHistory();
  const [hiddenFields, setHiddenFields] = useState({});

  const locations = parentResources?.locations?.records;
  const templateValue = getOrderTemplateValue(parentResources, order?.template, {
    locations,
  });
  const lineId = get(initialValues, 'id');
  const saveBtnLabelId = isCreateAnotherChecked ? 'save' : 'saveAndClose';
  const initialInventoryData = (
    !lineId && templateValue.id
      ? {
        ...pick(templateValue, [
          'instanceId',
          'titleOrPackage',
          'publisher',
          'publicationDate',
          'edition',
          'contributors',
          'details.productIds',
        ]),
      }
      : {}
  );

  useEffect(() => {
    setTimeout(() => {
      if (!lineId && templateValue.id) {
        form.batch(() => {
          GAME_CHANGER_FIELDS.forEach(field => {
            const templateField = POL_TEMPLATE_FIELDS_MAP[field] || field;
            const templateFieldValue = get(templateValue, templateField);

            if (templateFieldValue !== undefined) change(field, templateFieldValue);
          });
        });

        form.batch(() => {
          form.getRegisteredFields().forEach(field => {
            const templateField = POL_TEMPLATE_FIELDS_MAP[field] || field;
            const templateFieldValue = get(templateValue, templateField);

            if (templateFieldValue !== undefined) change(field, templateFieldValue);
          });
        });
      }
    });

    setHiddenFields(templateValue?.hiddenFields || {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change, lineId, templateValue.id]);

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

  const submitAndOpen = useCallback(() => {
    change('saveAndOpen', true);
    handleSubmit();
  }, [change, handleSubmit]);

  const submit = useCallback(() => {
    change('saveAndOpen', false);
    handleSubmit();
  }, [change, handleSubmit]);

  const getPaneFooter = () => {
    const start = (
      <FormattedMessage id="ui-orders.buttons.line.cancel">
        {([btnLabel]) => (
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
      <>
        {!lineId && (linesLimit > 1) && (
          <Checkbox
            label={<FormattedMessage id="ui-orders.buttons.line.createAnother" />}
            checked={isCreateAnotherChecked}
            onChange={e => toggleCreateAnother(e.target.checked)}
            className={styles.createAnotherCheckbox}
            inline
          />
        )}
        <Button
          data-test-button-save
          id="clickable-updatePoLine"
          type="submit"
          buttonStyle={buttonSaveStyle}
          disabled={!enableSaveBtn && (pristine || submitting)}
          onClick={submit}
        >
          <FormattedMessage id={`ui-orders.buttons.line.${saveBtnLabelId}`} />
        </Button>
        {isSaveAndOpenButtonVisible && (
          <Button
            data-test-button-save-and-open
            data-testid="button-save-and-open"
            type="submit"
            buttonStyle="primary mega"
            disabled={submitting || isCreateAnotherChecked}
            onClick={submitAndOpen}
          >
            <FormattedMessage id="ui-orders.buttons.line.saveAndOpen" />
          </Button>
        )}
      </>
    );

    return (
      <PaneFooter
        renderStart={start}
        renderEnd={end}
      />
    );
  };

  const [expandAll, stateSections, toggleSection] = useAccordionToggle(INITIAL_SECTIONS);

  const errorAccordions = Object.keys(form.getState().errors).map(
    (fieldName) => ({ [MAP_FIELD_ACCORDION[fieldName]]: true }),
  );
  const sections = errorAccordions.length
    ? {
      ...stateSections,
      ...(errorAccordions.reduce((accum, section) => ({ ...accum, ...section }), {})),
    }
    : stateSections;

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
      handler: () => expandAll(mapValues(stateSections, () => true)),
    },
    {
      name: 'collapseAllSections',
      handler: () => expandAll(mapValues(stateSections, () => false)),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push('/orders/lines')),
    },
  ];

  if (!initialValues) {
    return <LoadingPane defaultWidth="fill" onClose={onCancel} />;
  }

  const orderFormat = get(formValues, 'orderFormat');
  const showEresources = isEresource(orderFormat);
  const showPhresources = isPhresource(orderFormat);
  const showOther = isOtherResource(orderFormat);
  const materialTypes = getMaterialTypesForSelect(parentResources);
  const identifierTypes = getIdentifierTypesForSelect(parentResources);
  const contributorNameTypes = getContributorNameTypesForSelect(parentResources);
  const orderTemplates = getOrderTemplatesForSelect(parentResources);
  const locationIds = locations?.map(({ id }) => id);
  const isDisabledToChangePaymentInfo = ifDisabledToChangePaymentInfo(order);
  const estimatedPrice = calculateEstimatedPrice(formValues);
  const { accounts } = vendor;
  const fundDistribution = get(formValues, 'fundDistribution');
  const metadata = get(initialValues, 'metadata');
  const currency = get(formValues, 'cost.currency');

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
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
                        accordionStatus={sections}
                        onToggle={expandAll}
                      />
                    </Col>
                  </Row>
                </Col>

                <Col xs={12} md={8}>
                  <Row>
                    <Col xs={4}>
                      <FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.name">
                        {([translatedLabel]) => (
                          <Selection
                            dataOptions={orderTemplates}
                            label={translatedLabel}
                            value={order.template}
                            disabled
                          />
                        )}
                      </FormattedMessage>
                    </Col>

                    {
                      Boolean(order.template) && (
                        <IfPermission perm="ui-orders.order.showHidden">
                          <Col xs={4}>
                            <Checkbox
                              label={
                                <>
                                  <FormattedMessage id="ui-orders.order.showHidden" />
                                  <InfoPopover content={<FormattedMessage id="ui-orders.order.showHidden.info" />} />
                                </>
                              }
                              value={!hiddenFields}
                              onChange={toggleForceVisibility}
                              vertical
                            />
                          </Col>
                        </IfPermission>
                      )
                    }
                  </Row>
                </Col>

                <Col xs={12} md={8} style={{ textAlign: 'left' }}>
                  <AccordionSet
                    accordionStatus={sections}
                    onToggle={toggleSection}
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
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.vendor" />}
                      id={ACCORDION_ID.vendor}
                    >
                      <VendorForm
                        accounts={accounts}
                        order={order}
                        hiddenFields={hiddenFields}
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
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.fund" />}
                      id={ACCORDION_ID.fundDistribution}
                    >
                      <FundDistributionFieldsFinal
                        change={change}
                        currency={currency}
                        disabled={isDisabledToChangePaymentInfo}
                        fundDistribution={fundDistribution}
                        name="fundDistribution"
                        totalAmount={estimatedPrice}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.location" />}
                      id={ACCORDION_ID.location}
                    >
                      <LocationForm
                        changeLocation={changeLocation}
                        formValues={formValues}
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
                  </AccordionSet>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      </Pane>
    </HasCommand>
  );
}

POLineForm.propTypes = {
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
  isCreateAnotherChecked: PropTypes.bool,
  toggleCreateAnother: PropTypes.func.isRequired,
};

export default stripesForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  validateOnBlur: true,
  subscription: { values: true },
})(POLineForm);
