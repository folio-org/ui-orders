import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { useParams } from 'react-router';

import {
  LoadingPane,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import {
  TagsBadge,
  VersionHistoryButton,
} from '@folio/stripes-acq-components';

const VersionView = ({
  children,
  id,
  isLoading,
  onVersionClose,
  tags,
  ...props
}) => {
  const { versionId } = useParams();

  const lastMenu = useMemo(() => (
    <PaneMenu>
      <TagsBadge
        disabled
        tagsQuantity={tags?.length}
      />
      <VersionHistoryButton disabled />
    </PaneMenu>
  ), [tags?.length]);

  if (isLoading || !versionId) return <LoadingPane />;

  return (
    <Pane
      id={`${id}-version-view`}
      defaultWidth="fill"
      onClose={onVersionClose}
      lastMenu={lastMenu}
      {...props}
    >
      {children}
    </Pane>
  );
};

VersionView.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onVersionClose: PropTypes.func,
  version: PropTypes.object.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object),
};

export default memo(VersionView);
