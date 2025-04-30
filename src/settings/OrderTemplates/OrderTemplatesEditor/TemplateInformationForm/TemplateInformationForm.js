import find from 'lodash/find';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useMemo,
} from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Row,
  Col,
  TextField,
  TextArea,
} from '@folio/stripes/components';
import {
  FieldMultiSelectionFinal,
  validateRequired,
} from '@folio/stripes-acq-components';

import { FieldHideAll } from './FieldHideAll';

const parseMultiSelectionValue = (items) => items.map(({ value }) => value);

const TemplateInformationForm = ({ orderTemplateCategories }) => {
  const orderTemplateCategoriesOptions = useMemo(() => {
    return orderTemplateCategories.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
  }, [orderTemplateCategories]);

  const formatCategoriesFieldValue = useCallback((parsedIds) => {
    return parsedIds?.map(id => {
      const category = find(orderTemplateCategories, { id });

      return {
        label: category?.name || id,
        value: id,
      };
    });
  }, [orderTemplateCategories]);

  return (
    <Row>
      <Col xs={3}>
        <Field
          component={TextField}
          fullWidth
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.name" />}
          name="templateName"
          required
          validate={validateRequired}
          validateFields={[]}
          type="text"
        />
      </Col>

      <Col xs={3}>
        <Field
          component={TextField}
          fullWidth
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.code" />}
          name="templateCode"
          type="text"
          validateFields={[]}
        />
      </Col>

      <Col xs={3}>
        <FieldMultiSelectionFinal
          dataOptions={orderTemplateCategoriesOptions}
          format={formatCategoriesFieldValue}
          fullWidth
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.categories" />}
          name="categoryIds"
          parse={parseMultiSelectionValue}
          validateFields={[]}
        />
      </Col>

      <Col xs={3}>
        <Field
          component={TextArea}
          fullWidth
          label={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.description" />}
          name="templateDescription"
          validateFields={[]}
        />
      </Col>

      <Col xs={3}>
        <FieldHideAll />
      </Col>
    </Row>
  );
};

TemplateInformationForm.propTypes = {
  orderTemplateCategories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
};

export default TemplateInformationForm;
