# Change history for ui-orders

## [1.3.0] - Unreleased
* UIREC-14 Receiving: Access "Receiving History" for a PO

## [1.2.0](https://github.com/folio-org/ui-orders/tree/v1.2.0) (2019-02-22)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.1.1...v1.2.0)

* UIOR-111 Adjustments to PO Line number field on create/edit PO Line forms
* UIOR-121 PO Line: add "Locations" accordion and associated fields
* UIOR-122 Create POL: Populate "Item Details" using Instance information when selecting an existing title
* UIOR-116 ui-orders needs to be made compatible with updated mod-vendors interfaces
* UIOR-71 Adjustments to po_number field on create/edit order forms
* UIOR-75 Show PO line limit exceeded error message
* UIREC-12 Receiving: Access Receiving items pane from Orders (PO Line pane)
* UIREC-11 Create new component 'Update Item Details'
* UIREC-1 Receiving: Access Receiving items pane from Orders
* UIREC-2 Receiving: Receive items from a PO Line quantity
* UIREC-7 Create Receive Button
* FOLIO-1720 bump up to 3.0 orders OKAPI

## [1.1.1](https://github.com/folio-org/ui-orders/tree/v1.1.1) (2019-01-16)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.1.0...v1.1.1)

* UIOR-101 bumped up version of OKAPI mod-orders to 2.0.1
* UIOR-84 Edit PO Line -> Labels for header and Delete button

## [1.1.0](https://github.com/folio-org/ui-orders/tree/v1.1.0) (2019-01-15)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v1.0.0...v1.1.0)

* UIOR-46 Close order
* UIOR-70 PO: identify a reason for closure
* UIOR-66 PO Line Item Details: Type new Title or select a Title from inventory instances
* UIOR-9, UIOR-13 Unit tests (BigTest Mirage config) /orders API
* UIOR-59 Integrate PO Line Edit and Details with back-end API
* UIOR-60 PO Line: Update Activation Due field view properties
* UIOR-52 PO Line Details: Update possible "Order Formats"
* fix UIOR-79 Setting for PO Line Limit not actually being saved
* fix UIOR-90 Edit Order: Unable to clear Assigned To field
* fix UIOR-82 Indicate empty required field within accordions while creating Purchase Order Lines
* fix UIOR-85 Create/Edit Purchase Order -> Empty Notes

## [1.0.0](https://github.com/folio-org/ui-orders/tree/v1.0.0) (2018-12-07)
[Full Changelog](https://github.com/folio-org/ui-orders/compare/v0.1.0...v1.0.0)

* Revise requirements of fields on PO and PO Line forms (UIOR-48).
* PO Line: Add "Physical Resource Details" accordion and associated fields (UIOR-45).
* PO Line: Add "e-Resource Details" accordion and associated fields (UIOR-44).
* PO Line: Add "Item Details" accordion and associated fields (UIOR-43).
* PO Line: Add "Vendor" accordion and associated fields (UIOR-41).
* PO Line: Add "Fund Distribution" accordion and associated fields (UIOR-40).
* PO Line: Add "Cost Details" accordion and associated fields (UIOR-39).
* PO Line: Align Editable "PO Line Details" fields with Mockup (UIOR-38).
* Align editable Purchase Order Fields with Mockup (UIOR-36).
* Create Adjustments block (UIOR-35).
* Update PO Line - Receipt Status list values (UIOR-28).
* Call mod-orders (/orders/id) to get Composite Purchase Order (UIOR-26).
* Settings - Limit number of Purchase Order Lines per purchase order (UIOR-11).

## 0.1.0

* New app created with stripes-cli
