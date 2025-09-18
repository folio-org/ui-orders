export default (contributorNameTypes = []) => contributorNameTypes.map((v) => ({
  label: v.name,
  value: v.id,
}));
