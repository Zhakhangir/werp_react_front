import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  Button,
  Dropdown,
  Icon,
  Container,
  Header,
  Grid,
  Segment,
  Menu,
} from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';
import { modifyLoader } from '../../../general/loader/loader_action';
import OutputErrors from '../../../general/error/outputErrors';
import { fetchDynamicFAGM, clearDynObj } from '../../fa_action';
import { moneyFormat } from '../../../utils/helpers';
import { injectIntl } from 'react-intl';
import { messages } from '../../../locales/defineMessages';
import '../frep6/frep6.css';
import axios from 'axios';
import { ROOT_URL } from '../../../utils/constants';
require('moment/locale/ru');
require('moment/locale/tr');

class Frep6 extends Component {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.renderSearchTab = this.renderSearchTab.bind(this);
    this.searchFrep6 = this.searchFrep6.bind(this);
    this.validate = this.validate.bind(this);
    this.excelDownload = this.excelDownload.bind(this);

    this.state = {
      searchTerm: {
        bukrs: '',
        branchList: [],
        hkontCashBank: '0',
      },
      activeIndex: 0,
      errors: [],
    };
  }

  componentDidMount() {
    this.props.clearDynObj();
  }

  componentWillUnmount() {
    this.props.clearDynObj();
  }
  onInputChange(value, stateFieldName) {
    if (stateFieldName === 'activeIndex') {
      this.setState({ [stateFieldName]: value });
    } else if (stateFieldName === 'bukrs') {
      this.props.clearDynObj();
      this.setState({
        searchTerm: {
          ...this.state.searchTerm,
          [stateFieldName]: value,
          branchList: [],
        },
      });
    } else {
      this.props.clearDynObj();
      this.setState({
        searchTerm: { ...this.state.searchTerm, [stateFieldName]: value },
      });
    }
  }

  renderSearchTab() {
    const { formatMessage } = this.props.intl;
    const { branchOptions, companyOptions } = this.props;
    const { bukrs, branchList, hkontCashBank } = this.state.searchTerm;

    const cashBankOptions = [
      { key: 0, text: formatMessage(messages.all), value: '0' },
      { key: 1, text: formatMessage(messages.cashAccount), value: '1010' },
      { key: 2, text: formatMessage(messages.bankAccount), value: '1030' },
    ];

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16} tablet={16} computer={4}>
            <Table compact>
              <Table.Body>
                <Table.Row>
                  <Table.Cell collapsing>
                    <Icon name="folder" />
                    {formatMessage(messages.bukrs)}
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      fluid
                      placeholder={formatMessage(messages.bukrs)}
                      selection
                      options={companyOptions}
                      value={bukrs}
                      onChange={(e, { value }) =>
                        this.onInputChange(value, 'bukrs')
                      }
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Icon name="browser" />
                    {formatMessage(messages.brnch)}
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      placeholder={formatMessage(messages.all)}
                      fluid
                      multiple
                      search
                      selection
                      options={bukrs ? branchOptions[bukrs] : []}
                      value={branchList}
                      onChange={(e, { value }) =>
                        this.onInputChange(value, 'branchList')
                      }
                      noResultsMessage={null}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Icon name="browser" />
                    {formatMessage(messages.cashBank)}
                  </Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      selection
                      options={cashBankOptions || []}
                      value={hkontCashBank}
                      onChange={(e, { value }) =>
                        this.onInputChange(value, 'hkontCashBank')
                      }
                    />
                  </Table.Cell>
                </Table.Row>

                <Table.Row>
                  <Table.Cell />
                  <Table.Cell>
                    <Button
                      icon
                      labelPosition="left"
                      primary
                      size="small"
                      onClick={() => this.searchFrep6()}
                    >
                      <Icon name="search" size="large" />
                      {formatMessage(messages.search)}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  excelDownload() {
    let url = '';
    let filename = '';
    let tablename = '';

    url = `${ROOT_URL}/api/finance/reports/frep6/downloadExcel`;
    filename = 'frep6.xls';
    tablename = 'outputTable';
    return axios
      .post(
        url,
        {
          [tablename]: this.props[tablename],
        },
        {
          headers: {
            authorization: localStorage.getItem('token'),
          },
          responseType: 'blob',
        },
      )
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
      });
  }
  searchFrep6() {
    this.props.modifyLoader(true);
    let errors = [];
    errors = this.validate();
    if (errors === null || errors === undefined || errors.length === 0) {
      this.props.fetchDynamicFAGM('/api/finance/reports/frep6/search', {
        ...this.state.searchTerm,
        branchList: this.state.searchTerm.branchList.join(),
      });

      this.setState({
        activeIndex: 1,
      });
    } else {
      this.props.modifyLoader(false);
    }

    this.setState({ errors });
  }
  validate() {
    // getter
    // console.log(localStorage.getItem('language'),'error');

    const errorTable = JSON.parse(localStorage.getItem('errorTableString'));
    const language = localStorage.getItem('language');
    const errors = [];
    const { bukrs } = this.state.searchTerm;
    if (bukrs === null || bukrs === undefined || !bukrs) {
      errors.push(errorTable[`5${language}`]);
    }

    return errors;
  }
  render() {
    const { formatMessage } = this.props.intl;
    const { activeIndex } = this.state;
    const { outputTable } = this.props;

    return (
      <Container
        fluid
        style={{
          marginTop: '2em',
          marginBottom: '2em',
          paddingLeft: '2em',
          paddingRight: '2em',
        }}
      >
        <Header as="h2" block>
          {formatMessage(messages.transNameFrep1)}
        </Header>

        <Menu pointing stackable>
          <Menu.Item
            name={formatMessage(messages.searchParameters)}
            active={activeIndex === 0}
            onClick={() => {
              this.onInputChange(0, 'activeIndex');
            }}
            icon="search"
          />
          <Menu.Item
            name={formatMessage(messages.result)}
            active={activeIndex === 1}
            onClick={() => {
              this.onInputChange(1, 'activeIndex');
            }}
            icon="bar chart"
          />
        </Menu>

        <Segment className={activeIndex === 0 ? 'show' : 'hide'}>
          <OutputErrors errors={this.state.errors} />
          {this.renderSearchTab()}
        </Segment>
        <Segment className={activeIndex === 1 ? 'show' : 'hide'}>
          {outputTable && outputTable.length > 0 && (
            <Menu stackable size="small">
              <Menu.Item>
                <img
                  className="clickableItem"
                  src="/assets/img/xlsx_export_icon.png"
                  onClick={() => this.excelDownload()}
                />
              </Menu.Item>
            </Menu>
          )}
          {outputTable && (
            <Table compact>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    {formatMessage(messages.city)}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {formatMessage(messages.waers)}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {formatMessage(messages.hkont)}
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    {formatMessage(messages.name)}
                  </Table.HeaderCell>
                  <Table.HeaderCell>USD</Table.HeaderCell>
                  <Table.HeaderCell>KZT</Table.HeaderCell>
                  <Table.HeaderCell>UZS</Table.HeaderCell>
                  <Table.HeaderCell>KGS</Table.HeaderCell>
                  <Table.HeaderCell>AZN</Table.HeaderCell>
                  <Table.HeaderCell>MYR</Table.HeaderCell>
                  <Table.HeaderCell>
                    {formatMessage(messages.overallSum)} USD
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {outputTable.map((wa, idx) => {
                  // if (!wa.hkont){

                  // }
                  // {wa.hkont}
                  return (
                    <Table.Row
                      key={idx}
                      className={wa.hkont ? '' : 'subtotalRow'}
                    >
                      <Table.Cell>{wa.cityName}</Table.Cell>
                      <Table.Cell>{wa.waers}</Table.Cell>
                      <Table.Cell>{wa.hkont}</Table.Cell>
                      <Table.Cell>{wa.hkontName}</Table.Cell>
                      <Table.Cell>{moneyFormat(wa.usd)}</Table.Cell>
                      <Table.Cell>{moneyFormat(wa.kzt)}</Table.Cell>
                      <Table.Cell>{moneyFormat(wa.uzs)}</Table.Cell>
                      <Table.Cell>{moneyFormat(wa.kgs)}</Table.Cell>
                      <Table.Cell>{moneyFormat(wa.azn)}</Table.Cell>
                      <Table.Cell>{moneyFormat(wa.myr)}</Table.Cell>
                      <Table.Cell>{moneyFormat(wa.total_usd)}</Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table>
          )}
        </Segment>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  // console.log(state,'state')
  return {
    companyOptions: state.userInfo.companyOptions,
    branchOptions: state.userInfo.branchOptionsAll,
    outputTable: state.fa.dynamicObject.outputTable,
  };
}

export default connect(
  mapStateToProps,
  {
    modifyLoader,

    //cleared by dynamic clear function
    clearDynObj,
    fetchDynamicFAGM,
  },
)(injectIntl(Frep6));
