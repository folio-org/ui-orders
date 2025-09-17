# POLineForm Field Dependencies Documentation

## Introduction
In the PO Line form (POLineForm), some fields affect the values, availability, or requirement of other fields. Below is a dependency tree with comments for each influencing field.

---

## Dependency Tree

- **orderFormat**
  - Clears and/or changes:
    - `physical`, `eresource` — reset when format changes
    - `costQuantityPhysical`, `costQuantityElectronic`, `costListUnitPriceElectronic`, `costListUnitPrice` — reset
    - `locations[*].quantityPhysical`, `locations[*].quantityElectronic` — reset if the line is a package
    - `eresourceCreateInventory`, `eresourceActivationDue`, `physicalCreateInventory` — set depending on format
  - **Comment:** Changing the order format completely restructures related fields.

- **isPackage**
  - Affects:
    - `locations[*].quantityPhysical`, `locations[*].quantityElectronic` — reset on format change if the line is a package
  - **Comment:** If the line is a package, location quantities are reset.

- **isBinderyActive**
  - Affects:
    - `physicalCreateInventory` — set to a special value
    - `checkinItems` — becomes `true`
    - Restricts `orderFormat` values
  - **Comment:** Enabling bindery changes related fields and available order formats.

- **checkinItems**
  - Affects:
    - `receiptStatus` — may be changed automatically
  - **Comment:** Receiving workflow type affects receipt status.

- **receiptStatus**
  - Affects:
    - `checkinItems` — if "receipt not required" is selected, independent receiving is enabled automatically
  - **Comment:** Receipt status can trigger a change in receiving workflow type.

- **acquisitionMethod**
  - Affects:
    - `automaticExport` — set depending on acquisition method
  - **Comment:** Acquisition method can enable/disable automatic export.

- **fundDistribution**
  - Affects:
    - `donorOrganizationIds` — updated when fund distribution changes
  - **Comment:** Donor list depends on selected funds.

- **donorOrganizationIds**
  - Affects:
    - `donor` (deprecated field)
  - **Comment:** Link to deprecated field for backward compatibility.

- **locations**
  - Affects:
    - `fundDistribution` — filters available funds
    - `holdings` — filters available holdings
  - **Comment:** Locations determine available funds and holdings.

- **instanceId**
  - Affects:
    - `titleOrPackage`, `publisher`, `publicationDate`, `edition`, `contributors`, `details.productIds` — auto-filled when creating from instance
  - **Comment:** When creating a line from an instance, some fields are filled automatically.

- **packagePoLineId**
  - Affects:
    - `isPackage` — makes the line part of a package
  - **Comment:** Linking to a package changes the line type.

---

## Notes
- All dependencies are implemented via onChange handlers, useEffect, useCallback, and form batch operations.
- Some fields affect the availability/requirement of others, not just their values.
- Deprecated fields (`donor`) are supported for backward compatibility.

---

## Visualization (example)

```
orderFormat
├─ physical
├─ eresource
├─ costQuantityPhysical
├─ costQuantityElectronic
├─ costListUnitPriceElectronic
├─ costListUnitPrice
├─ locations[*].quantityPhysical
├─ locations[*].quantityElectronic
├─ eresourceCreateInventory
├─ eresourceActivationDue
└─ physicalCreateInventory

isPackage
├─ locations[*].quantityPhysical
└─ locations[*].quantityElectronic

isBinderyActive
├─ physicalCreateInventory
├─ checkinItems
└─ (restricts orderFormat values)

checkinItems
└─ receiptStatus

receiptStatus
└─ checkinItems

acquisitionMethod
└─ automaticExport

fundDistribution
└─ donorOrganizationIds

donorOrganizationIds
└─ donor

locations
├─ fundDistribution
└─ holdings

instanceId
├─ titleOrPackage
├─ publisher
├─ publicationDate
├─ edition
├─ contributors
└─ details.productIds

packagePoLineId
└─ isPackage
```

---

## Updates
If new fields are added or logic changes, be sure to update this documentation.
