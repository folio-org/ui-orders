export const getRecordMap = (records) => (
  records.reduce((acc, record) => {
    acc[record.id] = record;

    return acc;
  }, {})
);
