const Filters = () => {
  return [
    {
      label: 'Approval Status',
      name: 'approval_status',
      cql: 'approval_status',
      values: ['Approved', 'Pending', 'On hold']
    },
  ];
};

const SearchableIndexes = [
  { label: 'All', value: 'all', makeQuery: term => `(id="${term}*" or po_number="${term}*" or create="${term}*" or comments="${term}*" or assigned_to="${term}*")` },
  { label: 'ID', value: 'id', makeQuery: term => `(id="${term}*")` },
  { label: 'PO Number', value: 'po_number', makeQuery: term => `(po_number="${term}*")` },
  { label: 'Created', value: 'created', makeQuery: term => `(created="${term}*")` },
  { label: 'Comments', value: 'comments', makeQuery: term => `(comments="${term}*")` },
  { label: 'Assigned To', value: 'assigned_to', makeQuery: term => `(assigned_to="${term}*")` },
];

export { Filters, SearchableIndexes };
