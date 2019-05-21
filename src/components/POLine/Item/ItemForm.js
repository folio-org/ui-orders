import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Field,
  getFormValues,
} from 'redux-form';

import {
  find,
  get,
  isEqual,
} from 'lodash';

import {
  Col,
  Datepicker,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import {
  DATE_FORMAT,
  TIMEZONE,
} from '../../Utils/const';
import {
  Required,
  validateYear,
} from '../../Utils/Validate';
import ProductIdDetailsForm from './ProductIdDetailsForm';
import ContributorForm from './ContributorForm';

import css from './ItemForm.css';
import { ALLOWED_YEAR_LENGTH } from '../const';

class ItemForm extends Component {
  static propTypes = {
    stripes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    identifierTypes: PropTypes.arrayOf(PropTypes.object),
    initialValues: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      instanceId: '',
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

    dispatch(change('instanceId', id));
    this.setState({ instanceId: id });
    if (title) {
      dispatch(change('title', title));
      this.setState({ title });
    }
    if (publication && publication.length) {
      const { publisher, dateOfPublication = '' } = publication[0];

      dispatch(change('publisher', publisher));
      this.setState(({ publisher }));

      if (dateOfPublication.length === ALLOWED_YEAR_LENGTH) {
        dispatch(change('publicationDate', dateOfPublication));
        this.setState(({ publicationDate: dateOfPublication }));
      }
    }
    if (editions && editions.length) {
      const edition = editions[0];

      dispatch(change('edition', edition));
      this.setState(({ edition }));
    }
    if (contributors && contributors.length) {
      const lineContributors = contributors.map(({ name, contributorNameTypeId }) => ({
        contributor: name,
        contributorType: contributorNameTypeId,
      }));

      dispatch(change('contributors', lineContributors));
      this.setState(({ contributors: lineContributors }));
    }
    if (identifiers && identifiers.length) {
      const lineidentifiers = identifiers.map(({ identifierTypeId, value }) => ({
        productId: value,
        productIdType: find(identifierTypes, { id: identifierTypeId }).value,
      }));

      dispatch(change('details.productIds', lineidentifiers));
      this.setState(({ productIds: lineidentifiers }));
    }
  };

  setInstanceId = () => {
    const { dispatch, change, initialValues, stripes: { store } } = this.props;
    const formValues = getFormValues('POLineForm')(store.getState());
    const instanceId = this.state.instanceId || get(initialValues, 'instanceId', '');
    const title = this.state.title || get(initialValues, 'title', '');
    const publisher = this.state.publisher || get(initialValues, 'publisher', '');
    const publicationDate = this.state.publicationDate || get(initialValues, 'publicationDate', '');
    const edition = this.state.edition || get(initialValues, 'edition', '');
    const contributors = this.state.contributors.length ? this.state.contributors : get(initialValues, 'contributors', []);
    const productIds = this.state.productIds.length ? this.state.productIds : get(initialValues, 'details.productIds', []);
    const isEqualContributors = contributors.every(el => {
      const contributor = find(get(formValues, 'contributors', []), { 'contributor': el.contributor });

      return contributor ? isEqual(contributor, el) : false;
    });
    const isEqualProductIds = productIds.every(el => {
      const productId = find(get(formValues, 'details.productIds', []), { 'productId': el.productId });

      return productId ? isEqual(productId, el) : false;
    });

    if (
      instanceId
      && (title === formValues.title)
      && (publisher === formValues.publisher)
      && (publicationDate === formValues.publicationDate)
      && (edition === formValues.edition)
      && isEqualContributors
      && isEqualProductIds
    ) {
      dispatch(change('instanceId', instanceId));
    } else {
      dispatch(change('instanceId', ''));
    }
  }

  onChangeField = (value, fieldName) => {
    const { dispatch, change } = this.props;

    dispatch(change(fieldName, value));

    this.setInstanceId();
  };

  selectInstanceModal = () => {
    const { stripes } = this.props;
    const columnMapping = {
      title: <FormattedMessage id="ui-orders.instance.title" />,
      contributors: <FormattedMessage id="ui-orders.instance.contributors" />,
      publishers: <FormattedMessage id="ui-orders.instance.publishers" />,
    };

    return (
      <Pluggable
        aria-haspopup="true"
        columnMapping={columnMapping}
        dataKey="instances"
        disableRecordCreation
        searchButtonStyle="default"
        searchLabel="+"
        selectInstance={this.onAddInstance}
        stripes={stripes}
        type="find-instance"
        visibleColumns={['title', 'contributors', 'publishers']}
      >
        <span>[no instance-selection plugin]</span>
      </Pluggable>
    );
  };

  render() {
    return (
      <Row>
        <Col xs={12}>
          <div className={css.titleWrapper}>
            <Field
              component={TextField}
              fullWidth
              label={<FormattedMessage id="ui-orders.itemDetails.title" />}
              name="title"
              onChange={(e) => this.onChangeField(e.target.value, 'title')}
              required
              validate={Required}
            />
            <div className={css.addButton}>
              {this.selectInstanceModal()}
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
          <ContributorForm
            onChangeField={this.onChangeField}
            setInstanceId={this.setInstanceId}
          />
        </Col>
        <Col xs={6}>
          <Field
            backendDateStandard={DATE_FORMAT}
            component={Datepicker}
            dateFormat={DATE_FORMAT}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
            name="details.subscriptionFrom"
            timeZone={TIMEZONE}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
            name="publisher"
            onChange={(e) => this.onChangeField(e.target.value, 'publisher')}
          />
        </Col>
        <Col xs={6}>
          <Field
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
            name="details.subscriptionInterval"
            component={TextField}
            type="number"
            fullWidth
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
            name="publicationDate"
            onChange={(e) => this.onChangeField(e.target.value, 'publicationDate')}
            normalize={v => (v || null)}
            validate={validateYear}
          />
        </Col>
        <Col xs={6}>
          <Field
            backendDateStandard={DATE_FORMAT}
            component={Datepicker}
            dateFormat={DATE_FORMAT}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
            name="details.subscriptionTo"
            timeZone={TIMEZONE}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
            onChange={(e) => this.onChangeField(e.target.value, 'edition')}
            name="edition"
          />
        </Col>
        <Col xs={12}>
          <ProductIdDetailsForm
            identifierTypes={this.props.identifierTypes}
            onChangeField={this.onChangeField}
            setInstanceId={this.setInstanceId}
          />
        </Col>
        <Col xs={12}>
          <Field
            component={TextArea}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.description" />}
            name="description"
          />
        </Col>
      </Row>
    );
  }
}

export default ItemForm;
