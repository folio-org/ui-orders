import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  getFormSyncErrors,
  getFormValues,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { IfPermission } from '@folio/stripes/core';
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
  Row,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { FieldSelection } from '@folio/stripes-acq-components';

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
import { FundDistributionForm } from './FundDistribution';
import { ItemForm } from './Item';
import { OtherForm } from './Other';
import {
  ACCORDION_ID,
  MAP_FIELD_ACCORDION,
} from './const';
import getVendorsForSelect from '../Utils/getVendorsForSelect';
import getFundsForSelect from '../Utils/getFundsForSelect';
import getMaterialTypesForSelect from '../Utils/getMaterialTypesForSelect';
import getIdentifierTypesForSelect from '../Utils/getIdentifierTypesForSelect';
import getContributorNameTypesForSelect from '../Utils/getContributorNameTypesForSelect';
import getOrderTemplatesForSelect from '../Utils/getOrderTemplatesForSelect';

class POLineForm extends Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    stripes: PropTypes.shape({
      store: PropTypes.object.isRequired,
    }).isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    order: PropTypes.object.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
    poURL: PropTypes.string,
    location: PropTypes.object.isRequired,
    change: PropTypes.func,
    dispatch: PropTypes.func,
    vendor: PropTypes.object,
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

  getLastMenu = (id, label) => {
    const { pristine, submitting, handleSubmit } = this.props;

    return (
      <PaneMenu>
        <IfPermission perm="orders.po-lines.item.post">
          <Button
            id={id}
            type="submit"
            disabled={pristine || submitting}
            onClick={handleSubmit}
            style={{ marginBottom: '0', marginRight: '10px' }}
          >
            {label}
          </Button>
        </IfPermission>
      </PaneMenu>
    );
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
    const lastMenu = lineId ?
      this.getLastMenu('clickable-updatePoLine', <FormattedMessage id="ui-orders.buttons.line.save" />) :
      this.getLastMenu('clickable-createnewPoLine', <FormattedMessage id="ui-orders.buttons.line.save" />);

    if (!initialValues) {
      return (

        <Pane
          id="pane-podetails"
          defaultWidth="fill"
          paneTitle={<FormattedMessage id="ui-orders.line.paneTitle.details" />}
          firstMenu={firstMenu}
          lastMenu={lastMenu}
        >
          <div style={{ paddingTop: '1rem' }}>
            <Icon
              icon="spinner-ellipsis"
              width="100px"
            />
          </div>
        </Pane>
      );
    }

    const formValues = getFormValues('POLineForm')(store.getState());
    const orderFormat = get(formValues, 'orderFormat');
    const showEresources = isEresource(orderFormat);
    const showPhresources = isFresource(orderFormat);
    const showOther = isOtherResource(orderFormat);
    const vendors = getVendorsForSelect(parentResources);
    const funds = getFundsForSelect(parentResources);
    const materialTypes = getMaterialTypesForSelect(parentResources);
    const identifierTypes = getIdentifierTypesForSelect(parentResources);
    const contributorNameTypes = getContributorNameTypesForSelect(parentResources);
    const orderTemplates = getOrderTemplatesForSelect(parentResources);
    const {
      accounts,
      vendorCurrencies,
    } = vendor;

    return (
      <Pane
        id="pane-poLineForm"
        data-test-line-edit
        defaultWidth="fill"
        paneTitle={paneTitle}
        lastMenu={lastMenu}
        onClose={onCancel}
        firstMenu={firstMenu}
      >
        <form id="form-po-line">
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
                        <FieldSelection
                          dataOptions={orderTemplates}
                          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.name" />}
                          name="template"
                          readOnly
                        />
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
                      <ItemForm
                        formValues={formValues}
                        order={order}
                        contributorNameTypes={contributorNameTypes}
                        change={change}
                        dispatch={dispatch}
                        identifierTypes={identifierTypes}
                        initialValues={initialValues}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.details" />}
                      id={ACCORDION_ID.lineDetails}
                    >
                      <POLineDetailsForm
                        {...this.props}
                        formValues={formValues}
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
                        currencies={vendorCurrencies}
                        order={order}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.vendor" />}
                      id={ACCORDION_ID.vendor}
                    >
                      <VendorForm
                        accounts={accounts}
                        order={order}
                      />
                    </Accordion>
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.fund" />}
                      id={ACCORDION_ID.fundDistribution}
                    >
                      <FundDistributionForm
                        formValues={formValues}
                        funds={funds}
                        order={order}
                      />
                    </Accordion>
                    {showEresources && (
                      <Accordion
                        label={<FormattedMessage id="ui-orders.line.accordion.eresource" />}
                        id={ACCORDION_ID.eresources}
                      >
                        <EresourcesForm
                          materialTypes={materialTypes}
                          order={order}
                          vendors={vendors}
                        />
                      </Accordion>
                    )}
                    {showPhresources && (
                      <Accordion
                        label={<FormattedMessage id="ui-orders.line.accordion.physical" />}
                        id={ACCORDION_ID.physical}
                      >
                        <PhysicalForm
                          materialTypes={materialTypes}
                          vendors={vendors}
                          order={order}
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
                          vendors={vendors}
                          order={order}
                        />
                      </Accordion>
                    )}
                    <Accordion
                      label={<FormattedMessage id="ui-orders.line.accordion.location" />}
                      id={ACCORDION_ID.location}
                    >
                      <LocationForm {...this.props} />
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
  enableReinitialize: true,
  form: 'POLineForm',
  navigationCheck: true,
})(POLineForm);
