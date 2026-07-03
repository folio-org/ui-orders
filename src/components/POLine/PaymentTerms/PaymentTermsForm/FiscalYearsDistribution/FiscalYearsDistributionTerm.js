import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Card,
  IconButton,
  Layout,
} from '@folio/stripes/components';

export const FiscalYearsDistributionTerm = ({
  label,
  onRemove,
  showRemoveButton,
}) => {
  const intl = useIntl();

  return (
    <Layout className="display-flex align-items-center">
      <Card
        headerStart={label}
        roundedBorder
      >
        TODO: Add fiscal year distribution term fields here
      </Card>
      {/* TODO: properly handle CSS */}
      <div style={{ width: '50px', display: 'flex', justifyContent: 'center' }}>
        {showRemoveButton && (
          <IconButton
            icon="trash"
            onClick={onRemove}
            aria-label={intl.formatMessage({ id: 'ui-orders.poLine.paymentTerms.FYDistributions.action.remove' })}
          />
        )}
      </div>
    </Layout>
  );
};

FiscalYearsDistributionTerm.propTypes = {
  label: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  showRemoveButton: PropTypes.bool.isRequired,
};
