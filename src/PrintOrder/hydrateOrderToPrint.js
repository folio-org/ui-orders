export function hydrateOrderToPrint({ order }) {
  if (!order) {
    return undefined;
  }

  const billToAddress = order.lines?.[0].billToRecord?.address;
  const shipToAddress = order.lines?.[0].shipToRecord?.address;
  const vendorPrimaryAddress = order.lines?.[0].vendorRecord?.addresses?.find(({ isPrimary }) => isPrimary);
  const vendorPrimaryPhone = order.lines?.[0].vendorRecord?.phoneNumbers?.find(({ isPrimary }) => isPrimary);

  return {
    ...order,
    billToAddress,
    shipToAddress,
    vendorPrimaryAddress,
    vendorPrimaryPhone,
    vendor: order.lines?.[0].vendorRecord,
  };
}
