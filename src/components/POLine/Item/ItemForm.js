/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import {
  Checkbox,
  Col,
  Icon,
  InfoPopover,
  Label,
  Row,
  TextArea,
} from '@folio/stripes/components';
import {
  FieldDatepickerFinal,
  selectOptionsShape,
  TextField,
} from '@folio/stripes-acq-components';

import { IfFieldVisible } from '../../../common/IfFieldVisible';
import { VisibilityControl } from '../../../common/VisibilityControl';
import ContributorForm from './ContributorForm';
import ProductIdDetailsForm from './ProductIdDetailsForm';
import InstancePlugin from './InstancePlugin';
import {
  shouldSetInstanceId,
  getInventoryData,
  createPOLDataFromInstance,
} from './util';
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import PackagePoLineField from './PackagePoLineField';
import { TitleField } from './TitleField';
// import { SubscriptionIntervalField } from './SubscriptionIntervalField';
import css from './ItemForm.css';

class ItemForm extends Component {
  static propTypes = {
    change: PropTypes.func.isRequired,
    batch: PropTypes.func.isRequired,
    identifierTypes: selectOptionsShape,
    contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
    initialValues: PropTypes.object,
    order: PropTypes.object.isRequired,
    formValues: PropTypes.object.isRequired,
    required: PropTypes.bool,
    hiddenFields: PropTypes.object,
    isCreateFromInstance: PropTypes.bool,
    lineId: PropTypes.string,
  };

  static defaultProps = {
    initialValues: {},
    hiddenFields: {},
    required: true,
    isCreateFromInstance: false,
  };

  constructor(props) {
    super(props);

    this.state = getInventoryData(props.initialValues);
  }

  onAddLinkPackage = ([selectedPoLine]) => {
    const { change } = this.props;

    change('packagePoLineId', selectedPoLine?.id || null);
  };

  onAddInstance = (instance) => {
    const { batch, change, identifierTypes, formValues } = this.props;
    const inventoryData = createPOLDataFromInstance(instance, identifierTypes);

    batch(() => {
      Object.keys(inventoryData).forEach(field => {
        if (field === 'productIds') return change(`details.${field}`, inventoryData[field]);

        return change(field, inventoryData[field]);
      });
    });

    if (formValues.instanceId && formValues.instanceId !== inventoryData.instanceId) {
      change('locations', []);
    }

    this.setState(({
      instanceId: inventoryData.instanceId,
      title: get(inventoryData, 'titleOrPackage', ''),
      publisher: get(inventoryData, 'publisher', ''),
      publicationDate: get(inventoryData, 'publicationDate', null),
      edition: get(inventoryData, 'edition', ''),
      contributors: get(inventoryData, 'contributors', []),
      productIds: get(inventoryData, 'productIds', []),
    }));
  };

  onChangeField = (value, fieldName) => {
    const { change, formValues } = this.props;
    const inventoryData = this.state;
    const locations = formValues?.locations;

    if (fieldName) change(fieldName, value);

    setTimeout(() => {
      if (shouldSetInstanceId(this.props.formValues, inventoryData)) {
        change('instanceId', inventoryData.instanceId);
      } else {
        change('instanceId', null);
        if (Array.isArray(locations)) {
          locations.forEach((_, i) => change(`locations[${i}].holdingId`, null));
        }
      }
    });
  };

  setTitleOrPackage = ({ target: { value } }) => {
    this.onChangeField(value, 'titleOrPackage');
  };

  setIsPackage = () => {
    const { batch, change, formValues } = this.props;
    const isPackageValue = !formValues?.isPackage;

    this.onChangeField(isPackageValue, 'isPackage');
    this.onChangeField(isPackageValue, 'checkinItems');

    if (isPackageValue) {
      batch(() => {
        formValues?.locations?.forEach((_, i) => {
          change(`locations[${i}].quantityPhysical`, null);
          change(`locations[${i}].quantityElectronic`, null);
        });
      });
    }
  };

  setPublisher = ({ target: { value } }) => {
    this.onChangeField(value, 'publisher');
  };

  setPublicationDate = ({ target: { value } }) => {
    this.onChangeField(value || null, 'publicationDate');
  };

  setEdition = ({ target: { value } }) => {
    this.onChangeField(value, 'edition');
  };

  getTitleLabel = () => {
    const { required, formValues } = this.props;
    const instanceId = get(formValues, 'instanceId');
    const isPackage = get(formValues, 'isPackage');
    const title = (
      <Label className={css.titleLabel} required={required} tagName="div">
        {
          isPackage
            ? <FormattedMessage id="ui-orders.itemDetails.packageName" />
            : <FormattedMessage id="ui-orders.itemDetails.title" />
        }
      </Label>
    );
    const connectedTitle = (
      <>
        {title}
        <Link
          data-test-connected-link
          to={`/inventory/view/${instanceId}`}
          target="_blank"
        >
          <FormattedMessage id="ui-orders.itemDetails.connectedTitle" />
          <Icon
            size="small"
            icon="external-link"
          />
        </Link>
      </>
    );
    const notConnectedTitle = (
      <>
        {title}
        <div>
          <FormattedMessage id="ui-orders.itemDetails.notConnectedTitle" />
          <InfoPopover content={<FormattedMessage id="ui-orders.itemDetails.notConnectedInfo" />} />
        </div>
      </>
    );

    if (!this.state.instanceId) {
      return title;
    }

    return instanceId ? connectedTitle : notConnectedTitle;
  }

  render() {
    const isPostPendingOrder = !isWorkflowStatusIsPending(this.props.order);
    const {
      contributorNameTypes,
      formValues,
      identifierTypes,
      isCreateFromInstance,
      required,
      hiddenFields,
      lineId,
    } = this.props;
    const isPackage = Boolean(formValues?.isPackage);
    const isSelectInstanceVisible = !(isPackage || isPostPendingOrder || isCreateFromInstance);

    return (
      <>
        <Row>
          <IfFieldVisible visible={!hiddenFields.isPackage} name="isPackage">
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.isPackage">
                <Field
                  component={Checkbox}
                  fullWidth
                  label={<FormattedMessage id="ui-orders.poLine.package" />}
                  name="isPackage"
                  onChange={this.setIsPackage}
                  type="checkbox"
                  disabled={isPostPendingOrder || isCreateFromInstance}
                />
              </VisibilityControl>
            </Col>
          </IfFieldVisible>
        </Row>
        <Row>
          <Col xs={12}>
            <TitleField
              label={this.getTitleLabel()}
              isNonInteractive={isPostPendingOrder}
              onChange={this.setTitleOrPackage}
              poLineDetails={formValues}
              required={required}
              disabled={isCreateFromInstance}
            />
            {isSelectInstanceVisible && <InstancePlugin addInstance={this.onAddInstance} />}
          </Col>
        </Row>
        <Row>
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.receivingNote" />}
              name="details.receivingNote"
              validateFields={[]}
            />
          </Col>
          {!lineId && (
            <Col
              xs={6}
              md={3}
            >
              <Field
                component={Checkbox}
                fullWidth
                label={<FormattedMessage id="ui-orders.itemDetails.isAcknowledged" />}
                name="isAcknowledged"
                type="checkbox"
                vertical
                validateFields={[]}
              />
            </Col>
          )}
        </Row>
        <Row>
          <IfFieldVisible visible={!hiddenFields.details?.subscriptionFrom} name="details.subscriptionFrom">
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.details.subscriptionFrom">
                <FieldDatepickerFinal
                  label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
                  name="details.subscriptionFrom"
                  validateFields={[]}
                />
              </VisibilityControl>
            </Col>
          </IfFieldVisible>

          <IfFieldVisible visible={!hiddenFields.details?.subscriptionTo} name="details.subscriptionTo">
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.details.subscriptionTo">
                <FieldDatepickerFinal
                  label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
                  name="details.subscriptionTo"
                  isNonInteractive={isPostPendingOrder}
                  validateFields={[]}
                />
              </VisibilityControl>
            </Col>
          </IfFieldVisible>

          <IfFieldVisible visible={!hiddenFields.details?.subscriptionInterval} name="details.subscriptionInterval">
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.details.subscriptionInterval">
                <Field
                  label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
                  name="details.subscriptionInterval"
                  component={TextField}
                  type="number"
                  fullWidth
                  isNonInteractive={isPostPendingOrder}
                  validateFields={[]}
                />
              </VisibilityControl>
            </Col>
          </IfFieldVisible>
        </Row>
        <Row>
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              disabled={isCreateFromInstance}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
              name="publicationDate"
              onChange={this.setPublicationDate}
              isNonInteractive={isPostPendingOrder}
              validateFields={[]}
            />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              disabled={isCreateFromInstance}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
              name="publisher"
              onChange={this.setPublisher}
              isNonInteractive={isPostPendingOrder}
              validateFields={[]}
            />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              fullWidth
              disabled={isCreateFromInstance}
              label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
              onChange={this.setEdition}
              name="edition"
              isNonInteractive={isPostPendingOrder}
              validateFields={[]}
            />
          </Col>

          <IfFieldVisible visible={!hiddenFields.packagePoLineId} name="packagePoLineId">
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.packagePoLineId">
                <PackagePoLineField
                  disabled={isPackage}
                  onSelectLine={this.onAddLinkPackage}
                  poLineId={formValues?.packagePoLineId}
                />
              </VisibilityControl>
            </Col>
          </IfFieldVisible>
        </Row>
        <Row>
          <Col xs={12}>
            <ContributorForm
              contributorNameTypes={contributorNameTypes}
              isNonInteractive={isPostPendingOrder}
              onChangeField={this.onChangeField}
              disabled={isCreateFromInstance}
              required={required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ProductIdDetailsForm
              identifierTypes={identifierTypes}
              isNonInteractive={isPostPendingOrder}
              onChangeField={this.onChangeField}
              disabled={isCreateFromInstance}
              required={required}
            />
          </Col>
        </Row>
        <Row>
          <IfFieldVisible visible={!hiddenFields.description} name="description">
            <Col
              xs={6}
              md={3}
            >
              <VisibilityControl name="hiddenFields.description">
                <Field
                  component={TextArea}
                  fullWidth
                  label={<FormattedMessage id="ui-orders.itemDetails.internalNote" />}
                  name="description"
                  validateFields={[]}
                />
              </VisibilityControl>
            </Col>
          </IfFieldVisible>
        </Row>
      </>
    );
  }
}

export default ItemForm;
