import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Segment, Table, Input } from 'semantic-ui-react';
import { moneyFormat } from '../../../utils/helpers';
import 'react-table/react-table.css';
import { injectIntl } from 'react-intl';
import { messages } from '../../../locales/defineMessages';
import {
  f4FetchCashBankBalanceList,
  f4ClearAnyObject,
} from '../../../reference/f4/f4_action';

class CashBankBalance extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bukrs !== undefined && nextProps.bukrs !== this.props.bukrs) {
      this.props.f4ClearAnyObject('F4_CLEAR_CASHBANK_BALANCE_LIST');
    }
    if (nextProps.brnch !== undefined && nextProps.brnch !== this.props.brnch) {
      this.setState({ loading: true });
      this.props.f4FetchCashBankBalanceList(
        nextProps.bukrs,
        nextProps.brnch,
        () => this.setState({ loading: false }),
      );
    }
  }

  componentWillUnmount() {
    this.props.f4ClearAnyObject('F4_CLEAR_CASHBANK_BALANCE_LIST');
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { cashBankBalanceList, show } = this.props;
    const { loading } = this.state;

    if (!cashBankBalanceList || show === false) {
      return '';
    }
    return (
      <Segment loading={loading}>
        <Table collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                {formatMessage(messages.cashBank)}
              </Table.HeaderCell>
              <Table.HeaderCell>
                {formatMessage(messages.amount)}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {cashBankBalanceList.map((item, key) => (
              <Table.Row key={key}>
                <Table.Cell textAlign="center">{item.hkont_name}</Table.Cell>
                <Table.Cell>
                  <Input
                    label={item.waers}
                    labelPosition="left"
                    color="teal"
                    value={moneyFormat(item.amount)}
                    readOnly
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

function mapStateToProps(state) {
  return {
    cashBankBalanceList: state.f4.cashBankBalanceList,
  };
}

export default connect(
  mapStateToProps,
  {
    f4FetchCashBankBalanceList,
    f4ClearAnyObject,
  },
)(injectIntl(CashBankBalance));
