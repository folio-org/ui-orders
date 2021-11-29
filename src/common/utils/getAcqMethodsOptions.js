export const getAcqMethodsOptions = (records = []) => (
  records.map(({ id, value }) => ({ label: value, value: id }))
);
