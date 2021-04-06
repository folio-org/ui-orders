import React, { forwardRef, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'react-fast-compare';
import get from 'lodash/get';

import {
  Col,
  Grid,
  Row,
  KeyValue,
} from '@folio/stripes/components';

import { LINE_FIELDS_MAP, LINE_FIELDS_LABELS } from '../ComponentToPrint/constants';
import cSS from '../ComponentToPrint/CtoPr.css';
import css from './PrintContent.css';

function PrintColumn({ path, source }) {
  if (path === LINE_FIELDS_MAP.fundDistribution) {
    return source[path]?.map(({ code }) => code).join() || null;
  }

  // console.log('path', path, get(source, path, null));

  const value = get(source, path, null);

  if (value === true) {
    return 'true';
  } else if (value === false) {
    return 'false';
  }

  return value;
}

const PrintContentTable = forwardRef(({ dataSource }, ref) => {
  // const templateFn = useMemo(() => buildTemplate(template), [template]);

  return (
    <div className={css.hiddenContent}>
      <div
        ref={ref}
        style={{ pageBreakAfter: 'always' }}
      >
        <div>
          <Grid>
            <Row>
              <Col xs={6}>Lib name</Col>
              <Col xs={6}>Purchase order</Col>
            </Row>
            <Row>
              <Col xs={6}>
                <div>Bill to address:</div>
                <div>some billing address</div>
              </Col>
              <Col xs={6}>
                <div>Date: {dataSource.metadata.created_at}</div>
                <div>PO#: {dataSource.poNumber}</div>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <div>Vendor</div>
                <div>Primary address</div>
                <div>Phone</div>
              </Col>
              <Col xs={6}>
                <div>Ship to</div>
                <div>
                  some other adres
                  3434
                </div>
              </Col>
            </Row>
          </Grid>
          <Row className={cSS.space}>------------------------------------</Row>
          <div className={css.table}>
            <div className={css.row}>
              {Object.keys(LINE_FIELDS_MAP).map((col) => {
                // console.log('col', col, LINE_FIELDS_LABELS[LINE_FIELDS_MAP[col]]);
                return (
                  <div key={col}>
                    {LINE_FIELDS_LABELS[LINE_FIELDS_MAP[col]]}
                  </div>
                );
              })}
            </div>
            {dataSource.compositePoLines.map((line) => {
              return (
                <div className={css.row} key={line.id}>
                  {Object.keys(LINE_FIELDS_MAP).map((col) => {
                    return (
                      <div key={col}>
                        <PrintColumn path={LINE_FIELDS_MAP[col]} source={line} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <Row className={cSS.space}>------------------------------------</Row>

          <Row>
            {Object.keys(LINE_FIELDS_MAP).map((col) => {
              return (
                <Col xs={3} className={cSS.colHead} key={col}>
                  {LINE_FIELDS_LABELS[LINE_FIELDS_MAP[col]]}
                </Col>
              );
            })}
          </Row>

          {dataSource.compositePoLines.map((line) => {
            return (
              <Row key={line.id} className={cSS.dataRow}>
                {Object.keys(LINE_FIELDS_MAP).map((col) => {
                  return (
                    <Col xs={3} key={col} className={cSS.colB}>
                      <PrintColumn path={LINE_FIELDS_MAP[col]} source={line} />
                    </Col>
                  );
                })}
              </Row>
            );
          })}

          <Row className={cSS.space}>------------------------------------</Row>

          <Row>
            <Col xs={6}>
              {LINE_FIELDS_LABELS['vendorDetail.instructions']}: {
                dataSource.compositePoLines.map((line) => {
                  return (
                    <span key={line.id}>
                      {line.vendorDetail?.instructions}
                    </span>
                  );
                })
              }
            </Col>
            <Col xs={6}>
              <div>Subtotal: ???</div>
              <div>Add cost: ???</div>
              <div>Discount: ???</div>
              <div>Total: ???</div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
});

PrintContentTable.propTypes = {
  // dataSource: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataSource: PropTypes.object.isRequired,
  // template: PropTypes.string.isRequired,
};

export default memo(PrintContentTable, isEqual);
