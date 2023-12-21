import PropTypes from 'prop-types';
import {
  useCallback,
  useContext,
  useMemo,
} from 'react';

import {
  DonorsListContainer,
  VersionViewContext,
} from '@folio/stripes-acq-components';
import { TextLink } from '@folio/stripes/components';

import { getDonorUrl } from './utils';

export const DonorsVersionView = ({ version }) => {
  const donorOrganizationIds = version?.donorOrganizationIds;
  const versionContext = useContext(VersionViewContext);

  const changedDonorIds = useMemo(() => {
    const changedDonors = versionContext?.changes?.filter((change) => {
      return change.path.startsWith('donorOrganizationIds');
    });
    const donorIds = changedDonors.map(({ values }) => values.filter(Boolean));

    return donorIds.flat();
  }, [versionContext?.changes]);

  const renderKeyValueComponent = useCallback(({ value, id, asLink = false }) => {
    const content = asLink ? <TextLink to={getDonorUrl(id)}>{value}</TextLink> : value;
    const isUpdated = changedDonorIds?.includes(id);

    const displayValue = isUpdated ? <mark>{content}</mark> : content;

    return displayValue;
  }, [changedDonorIds]);

  const formatter = {
    name: ({ name, id }) => renderKeyValueComponent({ value: name, id, asLink: true }),
    code: ({ code, id }) => renderKeyValueComponent({ value: code, id }),
  };

  return (
    <DonorsListContainer
      donorOrganizationIds={donorOrganizationIds}
      formatter={formatter}
    />
  );
};

DonorsVersionView.propTypes = {
  version: PropTypes.object.isRequired,
};
