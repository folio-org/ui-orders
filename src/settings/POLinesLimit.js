import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import SafeHTMLMessage from '@folio/react-intl-safe-html';

import {
  Callout,
} from '@folio/stripes/components';

import {
  CONFIG_LINES_LIMIT,
  MODULE_ORDERS,
} from '../components/Utils/const';
import { CONFIG_API } from '../components/Utils/api';
import POLinesLimitForm from './POLinesLimitForm';

class POLinesLimit extends Component {
  static manifest = Object.freeze({
    linesLimit: {
      type: 'okapi',
      records: 'configs',
      path: CONFIG_API,
      GET: {
        params: {
          query: `(module=${MODULE_ORDERS} and configName=${CONFIG_LINES_LIMIT})`,
        },
      },
    },
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    mutator: PropTypes.shape({
      linesLimit: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
        DELETE: PropTypes.func.isRequired,
      }),
    }).isRequired,
    resources: PropTypes.shape({
      linesLimit: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
  };

  constructor(props) {
    super(props);

    this.callout = React.createRef();

    this.styles = {
      poLineLimitFormWrapper: {
        width: '100%',
      },
    };
  }

  onChangePOLinesLimitFormSubmit = values => {
    const { linesLimit } = this.props.mutator;

    if (values.id) {
      if (values.value) {
        linesLimit
          .PUT(values)
          .then(() => {
            this.handleChangePOLinesLimitSuccess();
          });
      } else {
        linesLimit
          .DELETE({ id: values.id })
          .then(() => {
            this.handleChangePOLinesLimitSuccess();
          });
      }
    } else {
      linesLimit
        .POST({
          module: MODULE_ORDERS,
          configName: CONFIG_LINES_LIMIT,
          value: values.value,
        })
        .then(() => {
          this.handleChangePOLinesLimitSuccess();
        });
    }
  }

  handleChangePOLinesLimitSuccess = () => {
    const successMessage = (
      <SafeHTMLMessage id="ui-orders.settings.setPOLInesLimit.changed" />
    );

    this.callout.current.sendCallout({ message: successMessage });
  };

  render() {
    const { label, resources } = this.props;
    const initialValues = get(resources, ['linesLimit', 'records', 0], {});

    return (
      <div
        data-test-order-settings-lines-limit
        style={this.styles.poLineLimitFormWrapper}
      >
        <POLinesLimitForm
          initialValues={initialValues}
          onSubmit={this.onChangePOLinesLimitFormSubmit}
          paneTitle={label}
        />
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default POLinesLimit;
