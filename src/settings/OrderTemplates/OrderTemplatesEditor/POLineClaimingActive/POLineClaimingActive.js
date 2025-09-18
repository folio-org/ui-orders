import { useCallback } from 'react';
import { useForm } from 'react-final-form';

import { POL_FORM_FIELDS } from '../../../../common/constants';
import { FieldClaimingActive } from '../../../../common/POLFields';

const POLineClaimingActive = () => {
  const { change } = useForm();

  const onClaimingActiveChange = useCallback((event) => {
    const { target: { checked } } = event;

    change(POL_FORM_FIELDS.claimingActive, checked);
  }, [change]);

  return (
    <FieldClaimingActive onChange={onClaimingActiveChange} />
  );
};

export default POLineClaimingActive;
