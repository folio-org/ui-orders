export function hydrateOrderToPrint({ order }) {
  if (!order) {
    return undefined;
  }

  let totals = {};
  const billToAddress = order.lines?.[0].billToRecord?.address;
  const shipToAddress = order.lines?.[0].shipToRecord?.address;
  const vendorPrimaryAddress = order.lines?.[0].vendorRecord?.addresses?.find(({ isPrimary }) => isPrimary);
  const vendorPrimaryPhone = order.lines?.[0].vendorRecord?.phoneNumbers?.find(({ isPrimary }) => isPrimary);

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
    vendor: order.lines?.[0].vendorRecord,
  };
}
