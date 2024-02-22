export const hydrateOrderToPrint = async ({ order }) => {
  if (!order) {
    return undefined;
  }

  const billToAddress = order.billToRecord?.address || order.lines?.[0]?.billToRecord?.address;
  const shipToAddress = order?.shipToRecord?.address || order?.lines?.[0]?.shipToRecord?.address;
  const vendor = order.vendorRecord || order.lines?.[0]?.vendorRecord;
  const vendorPrimaryAddress = (order.vendorRecord?.addresses || order.lines?.[0]?.vendorRecord?.addresses)
    ?.find(({ isPrimary }) => isPrimary);
  const vendorPrimaryPhone = (order.vendorRecord?.phoneNumbers || order.lines?.[0]?.vendorRecord?.phoneNumbers)
    ?.find(({ isPrimary }) => isPrimary);

  return {
    ...order,
    billToAddress,
    shipToAddress,
    vendorPrimaryAddress,
    vendorPrimaryPhone,
    vendor,
  };
};
