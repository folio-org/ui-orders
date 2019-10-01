import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
} from 'redux-form';

import { get } from 'lodash';

import {
  Col,
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
import { isWorkflowStatusOpen } from '../../PurchaseOrder/util';

import css from './ItemForm.css';
import { ALLOWED_YEAR_LENGTH } from '../const';

const ALLOWED_RES_ID_TYPE_NAMES = [
  'ASIN',
  'CODEN',
  'DOI',
  'GPO item number',
  PRODUCT_ID_TYPE.isbn,
  'ISSN',
  'Publisher or distributor number',
  'Report number',
  'Standard technical report number',
  'URN',
];

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
    if (title) {
      dispatch(change('title', title));
      inventoryData.title = title;
    }
    if (publication && publication.length) {
      const { publisher, dateOfPublication = '' } = publication[0];

      dispatch(change('publisher', publisher));
      inventoryData.publisher = publisher;

      if (dateOfPublication.length === ALLOWED_YEAR_LENGTH) {
        dispatch(change('publicationDate', dateOfPublication));
        inventoryData.publicationDate = dateOfPublication;
      }
    }
    if (editions && editions.length) {
      const edition = editions[0];

      dispatch(change('edition', edition));
      inventoryData.edition = edition;
    }
    if (contributors && contributors.length) {
      const lineContributors = contributors.map(({ name, contributorNameTypeId }) => ({
        contributor: name,
        contributorNameTypeId,
      }));

      dispatch(change('contributors', lineContributors));
      inventoryData.contributors = lineContributors;
    }

    if (identifiers && identifiers.length) {
      const isbnTypeUUID = identifierTypes.find(({ label }) => label === PRODUCT_ID_TYPE.isbn).id;
      const allowedResIdentifierTypeIds = identifierTypes
        .filter(({ label }) => ALLOWED_RES_ID_TYPE_NAMES.includes(label))
        .map(({ value }) => value);
      const lineidentifiers = identifiers
        .filter(({ identifierTypeId }) => allowedResIdentifierTypeIds.includes(identifierTypeId))
        .map(({ identifierTypeId, value }) => {
          const productId = isbnTypeUUID === identifierTypeId
            ? value.split(QUALIFIER_SEPARATOR)[0]
            : value;

          return {
            productId,
            productIdType: identifierTypeId,
          };
        });

      dispatch(change('details.productIds', lineidentifiers));
      inventoryData.productIds = lineidentifiers;
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

  selectInstanceModal = (isDisabled) => {
    if (isDisabled) return false;

    return <InstancePlugin addInstance={this.onAddInstance} />;
  };

  render() {
    const isOpenedOrder = isWorkflowStatusOpen(this.props.order);
    const {
      contributorNameTypes,
      identifierTypes,
      required,
    } = this.props;

    return (
      <Fragment>
        <Row start="xs">
          <Col xs={12}>
            <div className={css.titleWrapper}>
              <Field
                component={TextField}
                fullWidth
                label={<FormattedMessage id="ui-orders.itemDetails.title" />}
                name="title"
                onChange={(e, value) => this.onChangeField(value, 'title')}
                required={required}
                validate={required && validateRequired}
                disabled={isOpenedOrder}
              />
              <div className={css.addButton}>
                {this.selectInstanceModal(isOpenedOrder)}
              </div>
            </div>
          </Col>
          <Col xs={6}>
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.instanceId" />}
              name="instanceId"
              readOnly
            />
          </Col>
          <Col xs={12}>
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.receivingNote" />}
              name="details.receivingNote"
            />
          </Col>
          <Col xs={6}>
            <FieldDatepicker
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
              name="details.subscriptionFrom"
            />
          </Col>
          <Col xs={6}>
            <FieldDatepicker
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
              name="details.subscriptionTo"
              disabled={isOpenedOrder}
            />
          </Col>
          <Col xs={6}>
            <Field
              label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
              name="details.subscriptionInterval"
              component={TextField}
              type="number"
              fullWidth
              disabled={isOpenedOrder}
            />
          </Col>
          <Col xs={6}>
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
              name="publicationDate"
              onChange={(e, value) => this.onChangeField(value, 'publicationDate')}
              normalize={v => (v || null)}
              validate={validateYear}
              disabled={isOpenedOrder}
            />
          </Col>
          <Col xs={6}>
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
              name="publisher"
              onChange={(e, value) => this.onChangeField(value, 'publisher')}
              disabled={isOpenedOrder}
            />
          </Col>
          <Col xs={6}>
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
              onChange={(e, value) => this.onChangeField(value, 'edition')}
              name="edition"
              disabled={isOpenedOrder}
            />
          </Col>
          <Col xs={12}>
            <ContributorForm
              contributorNameTypes={contributorNameTypes}
              onChangeField={this.onChangeField}
              disabled={isOpenedOrder}
              required={required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <ProductIdDetailsForm
              identifierTypes={identifierTypes}
              onChangeField={this.onChangeField}
              disabled={isOpenedOrder}
              required={required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.description" />}
              name="description"
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default ItemForm;
