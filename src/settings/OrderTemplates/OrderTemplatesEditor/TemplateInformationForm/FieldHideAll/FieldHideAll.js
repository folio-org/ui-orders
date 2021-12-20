import React from 'react';
import { Field, useForm } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  InfoPopover,
} from '@folio/stripes/components';

export const FieldHideAll = () => {
  const { change, getRegisteredFields } = useForm();

  const onChange = e => {
    const value = e.target.checked;

    change('hideAll', value);
    getRegisteredFields()
      .filter(field => field.startsWith('hiddenFields'))
      .forEach((field) => change(field, value));
  };

  const label = (
    <>
      <FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.hideAll" />
      <InfoPopover content={<FormattedMessage id="ui-orders.settings.orderTemplates.editor.template.hideAll.info" />} />
    </>
  );

  return (
    <Field
      component={Checkbox}
      fullWidth
      label={label}
      name="hideAll"
      type="checkbox"
      vertical
      validateFields={[]}
      onChange={onChange}
    />
  );
};
