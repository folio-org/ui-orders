export function hydrateOrderToPrint({ order }) {
  if (!order) {
    return undefined;
  }

  let totals = {};

  const billToAddress = order.billToRecord?.address || order.lines?.[0]?.billToRecord?.address;
  const shipToAddress = order?.shipToRecord?.address || order?.lines?.[0]?.shipToRecord?.address;
  const vendor = order.vendorRecord || order.lines?.[0]?.vendorRecord;
  const vendorPrimaryAddress = (order.vendorRecord?.addresses || order.lines?.[0]?.vendorRecord?.addresses)
    ?.find(({ isPrimary }) => isPrimary);
  const vendorPrimaryPhone = (order.vendorRecord?.phoneNumbers || order.lines?.[0]?.vendorRecord?.phoneNumbers)
    ?.find(({ isPrimary }) => isPrimary);

  if (order.lines?.length === 1) {
    const [{ poLineEstimatedPrice, quantityPhysical = 0, quantityElectronic = 0 }] = order.lines;

    totals = {
      totalItems: quantityPhysical + quantityElectronic,
      totalEstimatedPrice: poLineEstimatedPrice,
    };
  }

  return {
    ...order,
    ...totals,
    billToAddress,
    shipToAddress,
    vendorPrimaryAddress,
    vendorPrimaryPhone,
    vendor,
  };
}
