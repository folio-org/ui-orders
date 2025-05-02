import React, { useCallback } from 'react';
import { useForm } from 'react-final-form';

import { FieldClaimingActive } from '../../../../common/POLFields';

const POLineClaimingActive = () => {
  const { change } = useForm();

  const onClaimingActiveChange = useCallback((event) => {
    const { target: { checked } } = event;

    change('claimingActive', checked);
  }, [change]);

  return (
    <FieldClaimingActive onChange={onClaimingActiveChange} />
  );
};

export default POLineClaimingActive;
