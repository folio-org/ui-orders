import { useOrganization } from '@folio/stripes-acq-components';

const getRecordObject = (record, recordType, vendorName) => {
  if (recordType === 'order') {
    return {
      poNumber: record.poNumber,
      vendorName,
      workflowStatus: record.workflowStatus,
    };
  }

  return {
    paymentStatus: record.paymentStatus,
    poLineNumber: record.poLineNumber,
    receiptStatus: record.receiptStatus,
  };
};

export const useConnectedTasksJobsProps = (record, recordType) => {
  const { organization } = useOrganization(
    recordType === 'order' ? record.vendor : undefined,
  );

  return {
    recordId: record.id,
    recordObject: getRecordObject(record, recordType, organization?.name),
    recordType,
  };
};
