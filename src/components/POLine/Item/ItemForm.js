import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Col,
  Datepicker,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import MaterialTypesForm from './MaterialTypesForm';
import ProductIdDetailsForm from './ProductIdDetailsForm';
import ContributorForm from './ContributorForm';
import {
  DATE_FORMAT,
  TIMEZONE
} from '../../Utils/const';

class ItemForm extends Component {
  render() {
    const { parentResources } = this.props;

    return (
      <Row>
        <Col xs={12}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.title" />}
            name="title"
          />
        </Col>
        <Col xs={12}>
          <Field
            component={TextArea}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.receivingNote" />}
            name="receiving_note"
          />
        </Col>
        <Col xs={6}>
          <ContributorForm />
        </Col>
        <Col xs={6}>
          <Field
            backendDateStandard={DATE_FORMAT}
            component={Datepicker}
            dateFormat={DATE_FORMAT}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionFrom" />}
            name="subscription_from"
            timeZone={TIMEZONE}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.publisher" />}
            name="publisher"
          />
        </Col>
        <Col xs={6}>
          <Field
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionInterval" />}
            name="subscription_interval"
            component={TextField}
            type="number"
            fullWidth
          />
        </Col>
        <Col xs={6}>
          <Field
            backendDateStandard={DATE_FORMAT}
            component={Datepicker}
            dateFormat={DATE_FORMAT}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.publicationDate" />}
            name="publication_date"
            timeZone={TIMEZONE}
          />
        </Col>
        <Col xs={6}>
          <Field
            backendDateStandard={DATE_FORMAT}
            component={Datepicker}
            dateFormat={DATE_FORMAT}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.subscriptionTo" />}
            name="subscription_to"
            timeZone={TIMEZONE}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.itemDetails.edition" />}
            name="edition"
          />
        </Col>
        <Col xs={6}>
          <MaterialTypesForm materialTypes={parentResources.materialTypes} />
        </Col>
        <Col xs={12}>
          <ProductIdDetailsForm />
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

ItemForm.propTypes = {
  parentResources: PropTypes.shape({
    materialTypes: PropTypes.object.isRequired,
  }).isRequired,
};

export default ItemForm;
