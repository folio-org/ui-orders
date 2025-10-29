import { OPTION_VALUE_WITH_BINDERY_ACTIVE } from '../../../../components/POLine/const';
import { POL_FORM_FIELDS } from '../../../constants';

export const handleBinderyActiveFieldChange = (checked, form) => {
  if (checked) {
    form.batch(() => {
      form.change(POL_FORM_FIELDS.isBinderyActive, checked);
      form.change(POL_FORM_FIELDS.physicalCreateInventory, OPTION_VALUE_WITH_BINDERY_ACTIVE);
      form.change(POL_FORM_FIELDS.checkinItems, true);
    });
  } else {
    form.change(POL_FORM_FIELDS.isBinderyActive, false);
  }
};
