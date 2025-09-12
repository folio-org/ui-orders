import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  Layout,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  FieldSelectFinal,
  RepeatableFieldWithErrorMessage,
  TextField,
  VisibilityControl,
} from '@folio/stripes-acq-components';

import { POL_FORM_FIELDS } from '../../../common/constants';

const ContributorForm = ({
  onChangeField,
  onRemoveField,
  disabled,
  isNonInteractive,
  required,
  contributorNameTypes,
}) => {
  const isEditable = !(disabled || isNonInteractive);

  const renderForm = (elem) => {
    return (
      <Row start="xs">
        <Col xs={12}>
          <Row key={elem}>
            <Col xs={6}>
              <Field
                component={TextField}
                disabled={disabled}
                fullWidth
                isNonInteractive={isNonInteractive}
                label={<FormattedMessage id="ui-orders.itemDetails.contributor" />}
                name={`${elem}.contributor`}
                onChange={({ target: { value } }) => onChangeField(value, `${elem}.contributor`)}
                required={required}
                validateFields={[`${elem}.contributorNameTypeId`]}
              />
            </Col>
            <Col xs={5}>
              <FieldSelectFinal
                dataOptions={contributorNameTypes}
                disabled={disabled}
                fullWidth
                isNonInteractive={isNonInteractive}
                label={<FormattedMessage id="ui-orders.itemDetails.contributorType" />}
                name={`${elem}.contributorNameTypeId`}
                onChange={({ target: { value } }) => onChangeField(value, `${elem}.contributorNameTypeId`)}
                required={required}
                validateFields={[`${elem}.contributor`]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const legend = (
    <Layout className="display-flex">
      <FormattedMessage id="ui-orders.itemDetails.contributors" />
      <Layout className="margin-start-gutter">
        <VisibilityControl
          name="hiddenFields.details.contributors"
          detached
        />
      </Layout>
    </Layout>
  );

  return (
    <FieldArray
      component={RepeatableFieldWithErrorMessage}
      legend={legend}
      name={POL_FORM_FIELDS.contributors}
      addLabel={!isEditable ? null : <FormattedMessage id="ui-orders.itemDetails.addContributorBtn" />}
      emptyMessage={!isEditable ? <NoValue /> : <FormattedMessage id="ui-orders.itemDetails.addContributor" />}
      id="contributors"
      onRemove={onRemoveField}
      canAdd={isEditable}
      canRemove={isEditable}
      renderField={renderForm}
    />
  );
};

ContributorForm.propTypes = {
  onChangeField: PropTypes.func.isRequired,
  onRemoveField: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isNonInteractive: PropTypes.bool,
  required: PropTypes.bool,
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
};

ContributorForm.defaultProps = {
  contributorNameTypes: [],
  disabled: false,
  isNonInteractive: false,
  required: true,
};

export default ContributorForm;
