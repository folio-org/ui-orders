import PropTypes from 'prop-types';

import {
  Accordion,
  Loading,
} from '@folio/stripes/components';

import { ACCORDION_ID } from '../../POLine/const';
import POInvoices from './POInvoices';
import { useRelatedInvoices } from './useRelatedInvoices';

const POInvoicesContainer = ({
  isLoading,
  label,
  orderInvoicesIds,
}) => {
  const {
    isLoading: isInvoicesLoading,
    orderInvoices,
  } = useRelatedInvoices(orderInvoicesIds);

  return (
    <Accordion
      label={label}
      id={ACCORDION_ID.relatedInvoices}
    >
      {(isLoading || isInvoicesLoading) ? <Loading /> : <POInvoices orderInvoices={orderInvoices} />}
    </Accordion>
  );
};

POInvoicesContainer.propTypes = {
  isLoading: PropTypes.bool,
  label: PropTypes.node.isRequired,
  orderInvoicesIds: PropTypes.arrayOf(PropTypes.string),
};

export default POInvoicesContainer;
