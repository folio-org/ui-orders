import { setupStripesCore } from '@folio/stripes/core/test';
import translations from '@folio/stripes-acq-components/translations/stripes-acq-components/en';

import mirageOptions from '../network';
import { prefixKeys } from './prefixKeys';

export default function setupApplication({
  scenarios,
  hasAllPerms = true,
} = {}) {
  setupStripesCore({
    mirageOptions,
    scenarios,
    stripesConfig: {
      hasAllPerms,
    },
    translations: prefixKeys(translations, 'stripes-acq-components'),
  });
}
