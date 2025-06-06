export const ERROR_CODES = {
  accessProviderIsInactive: 'accessProviderIsInactive',
  accessProviderNotFound: 'accessProviderNotFound',
  budgetExpenseClassNotFound: 'budgetExpenseClassNotFound',
  budgetIsInactive: 'budgetIsInactive',
  budgetNotFoundForFiscalYear: 'budgetNotFoundForFiscalYear',
  budgetNotFoundForTransaction: 'budgetNotFoundForTransaction',
  conversionError: 'conversionError',
  costAdditionalCostInvalid: 'costAdditionalCostInvalid',
  costDiscountInvalid: 'costDiscountInvalid',
  costQtyPhysicalExceedsLoc: 'costQtyPhysicalExceedsLoc',
  costUnitPriceElectronicInvalid: 'costUnitPriceElectronicInvalid',
  costUnitPriceInvalid: 'costUnitPriceInvalid',
  currentFYearIdNotFound: 'currentFYearIdNotFound',
  currentFYearNotFound: 'currentFYearNotFound',
  deleteConnectedToInvoice: 'deleteConnectedToInvoice',
  deleteWithExpendedAmount: 'deleteWithExpendedAmount',
  electronicLocCostQtyMismatch: 'electronicLocCostQtyMismatch',
  encumbranceCreationFailure: 'encumbranceCreationFailure',
  encumbrancesForReEncumberNotFound: 'encumbrancesForReEncumberNotFound',
  errorRemovingInvoiceLineEncumbrances: 'errorRemovingInvoiceLineEncumbrances',
  errorRetrievingPoLines: 'errorRetrievingPoLines',
  errorRetrievingTransactions: 'errorRetrievingTransactions',
  forbiddenDeleteSystemValues: 'forbiddenDeleteSystemValues',
  forbiddenDeleteUsedValue: 'forbiddenDeleteUsedValue',
  fundCannotBePaid: 'fundCannotBePaid',
  fundLocationRestrictionViolation: 'fundLocationRestrictionViolation',
  fundsNotFound: 'fundsNotFound',
  holdingsByIdNotFoundError: 'holdingsByIdNotFoundError',
  idMismatch: 'idMismatch',
  inactiveExpenseClass: 'inactiveExpenseClass',
  incorrectFundDistributionTotal: 'incorrectFundDistributionTotal',
  InstanceIdNotAllowedForPackagePoLine: 'InstanceIdNotAllowedForPackagePoLine',
  itemCreationFailed: 'itemCreationFailed',
  itemNotFound: 'itemNotFound',
  itemNotRetrieved: 'itemNotRetrieved',
  itemUpdateFailed: 'itemUpdateFailed',
  ledgerNotFoundForTransaction: 'ledgerNotFoundForTransaction',
  locationIdAndHoldingIdAbsentError: 'locationIdAndHoldingIdAbsentError',
  locationUpdateWithoutAffiliation: 'locationUpdateWithoutAffiliation',
  locNotProvided: 'locNotProvided',
  locQtyElectronicExceedsCost: 'locQtyElectronicExceedsCost',
  locQtyPhysicalExceedsCost: 'locQtyPhysicalExceedsCost',
  materialTypeRequired: 'materialTypeRequired',
  mayBeLinkToEitherHoldingOrLocationError: 'mayBeLinkToEitherHoldingOrLocationError',
  missingContributorNameType: 'missingContributorNameType',
  missingHoldingsSourceId: 'missingHoldingsSourceId',
  missingInstanceStatus: 'missingInstanceStatus',
  missingInstanceType: 'missingInstanceType',
  missingLoanType: 'missingLoanType',
  missingOngoing: 'missingOngoing',
  multipleFiscalYears: 'multipleFiscalYears',
  multipleNonPackageTitles: 'multipleNonPackageTitles',
  nonZeroCostQtyElectronic: 'nonZeroCostQtyElectronic',
  nonZeroCostQtyPhysical: 'nonZeroCostQtyPhysical',
  nonZeroLocQtyPhysical: 'nonZeroLocQtyPhysical',
  ongoingNotAllowed: 'ongoingNotAllowed',
  orderAcqUnitsNotFound: 'orderAcqUnitsNotFound',
  orderApprovalRequired: 'orderApprovalRequired',
  orderClosed: 'orderClosed',
  orderGenericError1: 'orderGenericError1',
  orderIdMismatch: 'orderIdMismatch',
  orderIdRequired: 'orderIdRequired',
  orderNotFound: 'orderNotFound',
  orderOpen: 'orderOpen',
  orderRelatesToInvoice: 'orderRelatesToInvoice',
  organizationNotAVendor: 'organizationNotAVendor',
  partiallyReturnedCollection: 'partiallyReturnedCollection',
  pgException: 'pgException',
  physicalLocCostQtyMismatch: 'physicalLocCostQtyMismatch',
  piecesNeedToBeCreated: 'piecesNeedToBeCreated',
  piecesNeedToBeDeleted: 'piecesNeedToBeDeleted',
  polLimitExceeded: 'polLimitExceeded',
  poLineHasRelatedApprovedInvoice: 'poLineHasRelatedApprovedInvoice',
  poNumberNotUnique: 'poNumberNotUnique',
  poNumberPrefixRequired: 'poNumberPrefixRequired',
  poNumberRequired: 'poNumberRequired',
  poNumberSuffixRequired: 'poNumberSuffixRequired',
  prefixIsUsed: 'prefixIsUsed',
  prefixNotFound: 'prefixNotFound',
  protectedFieldChanging: 'protectedFieldChanging',
  renewalDateIsNotSet: 'renewalDateIsNotSet',
  renewalIntervalIsNotSet: 'renewalIntervalIsNotSet',
  suffixIsUsed: 'suffixIsUsed',
  suffixNotFound: 'suffixNotFound',
  titleNotFound: 'titleNotFound',
  userHasMissedAffiliations: 'userHasMissedAffiliations',
  userHasNoAcqUnitsPermission: 'userHasNoAcqUnitsPermission',
  userHasNoApprovalPermission: 'userHasNoApprovalPermission',
  userHasNoOrderUnopenPermission: 'userHasNoOrderUnopenPermission',
  userHasNoOrderReopenPermission: 'userHasNoOrderReopenPermission',
  userHasNoPermission: 'userHasNoPermission',
  vendorIsInactive: 'vendorIsInactive',
  vendorIssue: 'vendorIssue',
  vendorNotFound: 'vendorNotFound',
  zeroCostQty: 'zeroCostQty',
  zeroCostQtyElectronic: 'zeroCostQtyElectronic',
  zeroCostQtyPhysical: 'zeroCostQtyPhysical',
  zeroLocQty: 'zeroLocQty',
};
