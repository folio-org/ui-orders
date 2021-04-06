import React from 'react';
import PropTypes from 'prop-types';
import HtmlToReact, { Parser } from 'html-to-react';
import get from 'lodash/get';

import {
  Col,
  Grid,
  Row,
  KeyValue,
} from '@folio/stripes/components';

import { LINE_FIELDS_MAP, LINE_FIELDS_LABELS } from './constants';
import css from '../PrintContent/PrintContent.css';
import cSS from './CtoPr.css';

const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
const rules = [
  // {
  //   replaceChildren: true,
  //   shouldProcessNode: node => node.name === 'barcode',
  //   processNode: (_, children) => (<Barcode value={children[0] ? children[0].trim() : ' '} />),
  // },
  {
    replaceChildren: false,
    shouldProcessNode: node => node.name === 'col',
    processNode: (_, children) => (<Col />),
  },
  {
    replaceChildren: false,
    shouldProcessNode: node => node.name === 'row',
    processNode: (_, children) => (<Row />),
  },
  {
    replaceChildren: false,
    shouldProcessNode: node => node.name === 'grid',
    processNode: (_, children) => (<Grid />),
  },
  {
    shouldProcessNode: () => true,
    processNode: processNodeDefinitions.processDefaultNode,
  },
];

const parser = new Parser();

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

const ComponentToPrint = ({ dataSource, templateFn }) => {
  // const componentStr = templateFn(dataSource);
  // console.log('componentStr', componentStr);
  // const Component = parser.parseWithInstructions(componentStr, () => true, rules) || null;
  // console.log('Component', Component);

  // return Component;
  return (
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

      {dataSource.compositePoLines.map((line) => {
        return (
          <div key={line.id}>
            <Row>
              <Col xs={12}>
                <KeyValue
                  label={LINE_FIELDS_LABELS[LINE_FIELDS_MAP.poLineNumber]}
                >
                  {line.poLineNumber}
                </KeyValue>
              </Col>
            </Row>
            <Row className={cSS.colB}>
              {Object.keys(LINE_FIELDS_MAP).map((col) => {
                if (col === LINE_FIELDS_MAP.poLineNumber) return null;

                return (
                  <Col xs={3} key={col}>
                    <KeyValue
                      label={LINE_FIELDS_LABELS[LINE_FIELDS_MAP[col]]}
                    >
                      <PrintColumn path={LINE_FIELDS_MAP[col]} source={line} />
                    </KeyValue>
                  </Col>
                );
              })}
            </Row>
          </div>
        );
      })}

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
  );
};

ComponentToPrint.propTypes = {
  templateFn: PropTypes.func.isRequired,
  dataSource: PropTypes.object.isRequired,
};

export default ComponentToPrint;
