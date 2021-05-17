import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';

import {
  getColumns,
} from './utils';

import css from './PrintOrderLines.css';

export const PrintOrderLines = ({ lines = [] }) => {
  const lineColumns = useMemo(() => {
    return getColumns(lines).filter(({ hidden }) => !hidden);
  }, [lines]);

  return (
    <div>
      <Row
        className={css.poLineHeader}
        bottom="xs"
      >
        {
          lineColumns.map((column, i) => (
            <Col
              xs={column.size}
              key={i}
            >
              {column.title}
            </Col>
          ))
        }
      </Row>

      {
        lines.map((line) => (
          <Row
            key={line.id}
            className={css.poLineRow}
          >
            {
              lineColumns.map((column, i) => (
                <Col
                  key={i}
                  xs={column.size}
                  className={`${css.poLineColumn} ${css[column.align]}`}
                >
                  {column.render(line)}
                </Col>
              ))
            }
          </Row>
        ))
      }
    </div>
  );
};

PrintOrderLines.propTypes = {
  lines: PropTypes.arrayOf(PropTypes.object),
};
