const parseNumber = (value) => {
  return value && value.length > 0 ? Number(value) : null;
};

export default parseNumber;
