import {
  acqUnitsManifest,
  contributorNameTypesManifest,
  expenseClassesManifest,
  identifierTypesManifest,
  locationsManifest,
  materialTypesManifest,
  organizationsManifest,
  usersManifest,
  acquisitionMethodsResource,
} from '@folio/stripes-acq-components';

import { ADDRESSES } from '../../../components/Utils/resources';

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
});
