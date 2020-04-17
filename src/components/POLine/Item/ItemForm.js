import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';
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
  TextField,
} from '@folio/stripes/components';
import {
  FieldDatepicker,
  selectOptionsShape,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  validateYear,
} from '../../Utils/Validate';
import {
  PRODUCT_ID_TYPE,
  QUALIFIER_SEPARATOR,
} from '../../../common/constants';
import ContributorForm from './ContributorForm';
import ProductIdDetailsForm from './ProductIdDetailsForm';
import InstancePlugin from './InstancePlugin';
import {
  checkInstanceIdField,
  getInventoryData,
} from './util';
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';

import css from './ItemForm.css';
import { ALLOWED_YEAR_LENGTH } from '../const';

class ItemForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    identifierTypes: selectOptionsShape,
    contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
    initialValues: PropTypes.object,
    order: PropTypes.object.isRequired,
    formValues: PropTypes.object.isRequired,
    required: PropTypes.bool,
  };

  static defaultProps = {
    initialValues: {},
    required: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      title: '',
      publisher: '',
      publicationDate: '',
      edition: '',
      contributors: [],
      productIds: [],
    };
  }

  onAddInstance = (instance) => {
    const { dispatch, change, identifierTypes } = this.props;
    const { contributors, editions, publication, title, identifiers, id } = instance;
    const inventoryData = { instanceId: id };

    dispatch(change('instanceId', id));
    dispatch(change('titleOrPackage', title || ''));
    inventoryData.title = title || '';
    const { publisher, dateOfPublication } = publication?.[0] || {};

    dispatch(change('publisher', publisher || ''));
    inventoryData.publisher = publisher || '';

    const publicationDate = dateOfPublication?.length === ALLOWED_YEAR_LENGTH ? dateOfPublication : '';

    dispatch(change('publicationDate', publicationDate));
    inventoryData.publicationDate = publicationDate;

    const edition = editions?.[0] || '';

    dispatch(change('edition', edition));
    inventoryData.edition = edition;

    const lineContributors = contributors?.map(({ name, contributorNameTypeId }) => ({
      contributor: name,
      contributorNameTypeId,
    })) || [];

    dispatch(change('contributors', lineContributors));
    inventoryData.contributors = lineContributors;

    if (identifiers && identifiers.length) {
      const isbnTypeUUID = identifierTypes.find(({ label }) => label === PRODUCT_ID_TYPE.isbn).value;
      const allowedResIdentifierTypeIds = identifierTypes
        .map(({ value }) => value);
      const lineidentifiers = identifiers
        .filter(({ identifierTypeId }) => allowedResIdentifierTypeIds.includes(identifierTypeId))
        .map(({ identifierTypeId, value }) => {
          const result = {
            productId: value,
            productIdType: identifierTypeId,
          };

          if (isbnTypeUUID === identifierTypeId) {
            const [productId, ...qualifier] = value.split(QUALIFIER_SEPARATOR);

            result.productId = productId;
            result.qualifier = qualifier.join(QUALIFIER_SEPARATOR);
          }

          return result;
        });

      dispatch(change('details.productIds', lineidentifiers));
      inventoryData.productIds = lineidentifiers;
    } else {
      dispatch(change('details.productIds', []));
      inventoryData.productIds = [];
    }

    this.setState(({
      instanceId: inventoryData.instanceId,
      title: get(inventoryData, 'title', ''),
      publisher: get(inventoryData, 'publisher', ''),
      publicationDate: get(inventoryData, 'publicationDate', ''),
      edition: get(inventoryData, 'edition', ''),
      contributors: get(inventoryData, 'contributors', []),
      productIds: get(inventoryData, 'productIds', []),
    }));
  };

  onChangeField = (value, fieldName) => {
    const { formValues, dispatch, change, initialValues } = this.props;
    const inventoryData = getInventoryData(this.state, initialValues);

    dispatch(change(fieldName, value));

    if (checkInstanceIdField(formValues, inventoryData)) {
      dispatch(change('instanceId', inventoryData.instanceId));
    } else dispatch(change('instanceId', null));
  };

  setTitleOrPackage = ({ target: { value } }) => {
    this.onChangeField(value, 'titleOrPackage');
  };

  setIsPackage = ({ target: { value } }) => {
    const isPackageValue = value === 'false';

    this.onChangeField(isPackageValue, 'isPackage');
    this.onChangeField(isPackageValue, 'checkinItems');
  };

  setPublisher = ({ target: { value } }) => {
    this.onChangeField(value, 'publisher');
  };

  setPublicationDate = ({ target: { value } }) => {
    this.onChangeField(value, 'publicationDate');
  };

  setEdition = ({ target: { value } }) => {
    this.onChangeField(value, 'edition');
  };

  getTitleLabel = () => {
    const { required, formValues, initialValues } = this.props;
    const instanceId = get(formValues, 'instanceId');
    const isPackage = get(formValues, 'isPackage');
    const title = (
      <Label required={required}>
        {
          isPackage
            ? <FormattedMessage id="ui-orders.itemDetails.packageName" />
            : <FormattedMessage id="ui-orders.itemDetails.title" />
        }
      </Label>
    );
    const connectedTitle = (
      <Fragment>
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
      </Fragment>
    );
    const notConnectedTitle = (
      <Fragment>
        {title}
        <div>
          <FormattedMessage id="ui-orders.itemDetails.notConnectedTitle" />
          <InfoPopover content={<FormattedMessage id="ui-orders.itemDetails.notConnectedInfo" />} />
        </div>
      </Fragment>
    );

    if (!initialValues.instanceId && !this.state.instanceId) {
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
      required,
    } = this.props;
    const isSelectInstanceVisible = !(get(formValues, 'isPackage') || isPostPendingOrder);

    return (
      <Fragment>
        <Row>
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={Checkbox}
              fullWidth
              label={<FormattedMessage id="ui-orders.poLine.package" />}
              name="isPackage"
              onChange={this.setIsPackage}
              type="checkbox"
              disabled={isPostPendingOrder}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={6}
            md={3}
          >
            <div className={css.titleWrapper}>
              <Field
                component={TextField}
                fullWidth
                label={this.getTitleLabel()}
                name="titleOrPackage"
                onChange={this.setTitleOrPackage}
                validate={required ? validateRequired : undefined}
                disabled={isPostPendingOrder}
              />
              <div className={css.addButton}>
                {isSelectInstanceVisible && <InstancePlugin addInstance={this.onAddInstance} />}
              </div>
            </div>
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
              name="publisher"
              onChange={this.setPublisher}
              disabled={isPostPendingOrder}
            />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
              name="publicationDate"
              onChange={this.setPublicationDate}
              normalize={v => (v || null)}
              validate={validateYear}
              disabled={isPostPendingOrder}
            />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
              onChange={this.setEdition}
              name="edition"
              disabled={isPostPendingOrder}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={6}
            md={3}
          >
            <FieldDatepicker
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
              name="details.subscriptionFrom"
            />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <FieldDatepicker
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
              name="details.subscriptionTo"
              disabled={isPostPendingOrder}
            />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <Field
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
              name="details.subscriptionInterval"
              component={TextField}
              type="number"
              fullWidth
              disabled={isPostPendingOrder}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ContributorForm
              contributorNameTypes={contributorNameTypes}
              onChangeField={this.onChangeField}
              disabled={isPostPendingOrder}
              required={required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ProductIdDetailsForm
              identifierTypes={identifierTypes}
              onChangeField={this.onChangeField}
              disabled={isPostPendingOrder}
              required={required}
            />
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
            />
          </Col>
          <Col
            xs={6}
            md={3}
          >
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.internalNote" />}
              name="description"
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default ItemForm;
