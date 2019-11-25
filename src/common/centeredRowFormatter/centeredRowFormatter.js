import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import css from './centeredRowFormatter.css';

function centeredRowFormatter({ rowClass, cells, rowProps, labelStrings }) {
  return (
    <div
      className={classnames(
        rowClass,
        css.mclCellVCenter,
      )}
      aria-label={labelStrings.join('...')}
      role="row"
      {...rowProps}
      tabIndex="0"
    >
      {cells}
    </div>
  );
}

centeredRowFormatter.propTypes = {
  cells: PropTypes.arrayOf(PropTypes.element),
  labelStrings: PropTypes.arrayOf(PropTypes.string),
  rowClass: PropTypes.string,
  rowIndex: PropTypes.number,
  rowProps: PropTypes.object,
  rowWidth: PropTypes.number,
};

export default centeredRowFormatter;
