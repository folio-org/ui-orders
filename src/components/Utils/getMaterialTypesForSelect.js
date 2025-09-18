export default (materialTypes = []) => materialTypes.map(({ id, name }) => ({
  label: name,
  value: id,
}));
