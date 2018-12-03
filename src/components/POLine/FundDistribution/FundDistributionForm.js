import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Field,
  FieldArray,
  getFormValues,
} from 'redux-form';

import { get } from 'lodash';

import {
  Button,
  Col,
  KeyValue,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { Required } from '../../Utils/Validate';

class FundDistributionForm extends Component {
  static propTypes = {
    parentResources: PropTypes.shape({
      fund: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object).isRequired,
      }),
    }),
    stripes: PropTypes.shape({
      store: PropTypes.object.isRequired,
    }),
    dispatch: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  };

  addFields = (fields) => fields.push({});

  removeFields = (fields, index) => fields.remove(index);

  onChangeInput = (e, propertyName) => {
    const { dispatch, change } = this.props;

    dispatch(change(propertyName, e));
  };

  updateCode = (funds, index) => {
    const { stripes: { store } } = this.props;
    const formValues = getFormValues('POLineForm')(store.getState());
    const fundId = formValues.fund_distribution[index].id;
    const code = get(funds.find(fund => fund.value === fundId), 'code', '');

    return code;
  };

  calculateAmount = (index) => {
    const { stripes: { store } } = this.props;
    const formValues = getFormValues('POLineForm')(store.getState());
    const listPrice = parseFloat(formValues.cost.list_price);
    const quantityPhysical = parseInt(formValues.cost.quantity_physical, 10) || 0;
    const quantityElectronic = parseInt(formValues.cost.quantity_electronic, 10) || 0;
    const estimatedPrice = listPrice * (quantityPhysical + quantityElectronic);
    const fundDistributionPercentage = parseInt(formValues.fund_distribution[index].percentage, 10) || 0;
    const amount = parseFloat((fundDistributionPercentage / 100) * estimatedPrice).toFixed(2);

    return amount;
  };

  renderForm = ({ fields }) => {
    return (
      <Row>
        <Col xs={12}>
          {fields.length === 0 &&
            <Col xs={6}>
              <div>
                <em>
                  <FormattedMessage id="ui-orders.fundDistribution.add" />
                </em>
              </div>
            </Col>
          }
          {fields.map(this.renderSubForm)}
        </Col>
        <Col xs={12} style={{ paddingTop: '10px' }}>
          <Button onClick={() => this.addFields(fields)}>
            <FormattedMessage id="ui-orders.fundDistribution.addBtn" />
          </Button>
        </Col>
      </Row>
    );
  };

  renderSubForm = (elem, index, fields) => {
    const { parentResources } = this.props;
    const funds = get(parentResources, ['fund', 'records'], []).map((fund) => ({
      label: fund.name,
      value: fund.id,
      code: fund.code,
    }));

    return (
      <Row key={index}>
        <Col xs={6}>
          <Field
            component={Select}
            dataOptions={funds}
            fullWidth
            label={<FormattedMessage id="ui-orders.fundDistribution.id" />}
            name={`${elem}.id`}
            validate={[Required]}
            onChange={e => this.onChangeInput(e.target.value, 'fund_distribution.id')}
          />
        </Col>
        <Col xs={6}>
          <Field
            component={TextField}
            fullWidth
            label={<FormattedMessage id="ui-orders.fundDistribution.percent" />}
            name={`${elem}.percentage`}
            onChange={e => this.onChangeInput(e.target.value, 'fund_distribution.percentage')}
            type="number"
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.fundDistribution.code" />}
            value={this.updateCode(funds, index)}
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.fundDistribution.amount" />}
            value={this.calculateAmount(index)}
          />
        </Col>
        <Col
          xs={6}
        >
          <br />
          <Button
            buttonStyle="danger"
            onClick={() => this.removeFields(fields, index)}
          >
            <FormattedMessage id="ui-orders.fundDistribution.removeBtn" />
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <FieldArray
            component={this.renderForm}
            label="fund_distribution"
            name="fund_distribution"
          />
        </Col>
      </Row>
    );
  }
}

export default FundDistributionForm;
