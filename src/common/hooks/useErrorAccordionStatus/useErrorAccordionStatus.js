import { useMemo } from 'react';

export const useErrorAccordionStatus = ({ errors, fieldsMap }) => {
  const errorAccordionStatus = useMemo(() => {
    const errorAccordions = Object.keys(errors).map(
      (fieldName) => ({ [fieldsMap[fieldName]]: true }),
    );

    return errorAccordions.reduce((acc, section) => ({ ...acc, ...section }), {});
  }, [errors, fieldsMap]);

  return errorAccordionStatus;
};
