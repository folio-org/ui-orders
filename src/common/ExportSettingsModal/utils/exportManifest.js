import {
  acqUnitsManifest,
  acquisitionMethodsResource,
  baseManifest,
  contributorNameTypesManifest,
  expenseClassesManifest,
  FISCAL_YEARS_API,
  identifierTypesManifest,
  locationsManifest,
  materialTypesManifest,
  organizationsManifest,
  usersManifest,
} from '@folio/stripes-acq-components';

import {
  ADDRESSES,
  HOLDINGS,
  ORGANIZATION_TYPES,
} from '../../../components/Utils/resources';

export const exportManifest = Object.freeze({
  acquisitionMethods: {
    ...acquisitionMethodsResource,
    fetch: false,
    accumulate: true,
  },
  exportVendors: {
    ...organizationsManifest,
    fetch: false,
    accumulate: true,
  },
  exportUsers: {
    ...usersManifest,
    fetch: false,
    accumulate: true,
  },
  exportAddresses: {
    ...ADDRESSES,
    fetch: false,
    accumulate: true,
  },
  exportAcqUnits: {
    ...acqUnitsManifest,
    fetch: false,
    accumulate: true,
  },
  exportContributorNameTypes: {
    ...contributorNameTypesManifest,
    fetch: false,
    accumulate: true,
  },
  exportExpenseClasses: {
    ...expenseClassesManifest,
    fetch: false,
    accumulate: true,
  },
  exportIdentifierTypes: {
    ...identifierTypesManifest,
    fetch: false,
    accumulate: true,
  },
  exportLocations: {
    ...locationsManifest,
    fetch: false,
  },
  exportMaterialTypes: {
    ...materialTypesManifest,
    fetch: false,
  },
  exportHoldings: HOLDINGS,
  fiscalYears: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
    path: FISCAL_YEARS_API,
    records: 'fiscalYears',
  },
  organizationTypes: ORGANIZATION_TYPES,
});
