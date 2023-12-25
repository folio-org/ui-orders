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
    const changedDonors = versionContext?.changes?.filter(({ path, type }) => {
      return path.startsWith('donorOrganizationIds') && type === 'create';
    });
    const donorIds = changedDonors.map(({ values }) => values.filter(Boolean));

    return donorIds.flat();
  }, [versionContext?.changes]);

  const getFormattedValue = useCallback(({ value, id, asLink = false }) => {
    const content = asLink ? <TextLink to={getDonorUrl(id)}>{value}</TextLink> : value;
    const isUpdated = changedDonorIds?.includes(id);

    const formattedValue = isUpdated ? <mark>{content}</mark> : content;

    return formattedValue;
  }, [changedDonorIds]);

  const formatter = {
    name: ({ name, id }) => getFormattedValue({ value: name, id, asLink: true }),
    code: ({ code, id }) => getFormattedValue({ value: code, id }),
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
