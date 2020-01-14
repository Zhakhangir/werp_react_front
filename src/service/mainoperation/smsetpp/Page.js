import React, { useState, useEffect, Fragment } from 'react';
import {
  Segment,
  Dropdown,
  Icon,
  Button,
  Label,
  Message,
} from 'semantic-ui-react';
import ReactTableWrapper from '../../../utils/ReactTableWrapper';
import './index.css';
import { connect } from 'react-redux';
import 'react-table/react-table.css';
import AddPrice from './AddPrice';
import { injectIntl } from 'react-intl';
import { f4FetchCountryList } from '../../../reference/f4/f4_action';
import EditModal from './editModal';
import { fetchSmsetpp } from './../../serviceAction';
import OutputErrors from '../../../general/error/outputErrors';

const Page = props => {
  const {
    data,
    intl: { messages },
    countryList = [],
    companyOptions = [],
    f4FetchCountryList,
    fetchSmsetpp,
  } = props;
  const [error, setError] = useState([]);
  const errorTable = JSON.parse(localStorage.getItem('errorTableString'));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState();
  const language = localStorage.getItem('language');
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [secondActive, setSecondActive] = useState(false);
  const [allDropdownActive, setAllDropdownActive] = useState(false);
  const [serviceOptionPriceList, setServiceOptionPriceList] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [search, setSearch] = useState({
    companyId: '',
    countryId: '',
  });

  useEffect(() => {
    fetchSmsetpp();
    f4FetchCountryList();
  }, []);

  useEffect(() => {
    let country = countryList.map(item => {
      return { key: item.countryId, text: item.country, value: item.countryId };
    });
    setCountryOptions(country);
  }, [countryList]);

  useEffect(() => {
    console.log(data.service, 'dwa');
    setServiceOptionPriceList(data.service);
  }, [data]);

  const onChange = (text, value) => {
    if (text === 'companyOptions') {
      setSearch({ ...search, companyId: value });
      setActiveDropdown(true);
    }
    if (text === 'countries') {
      setSearch({ ...search, countryId: value });
      setSecondActive(true);
    }
  };

  const onClickButton = () => {
    save();
  };

  const validate = () => {
    const errors = [];
    if (!activeDropdown) {
      errors.push(errorTable[`5${language}`]);
    }
    if (!secondActive) {
      errors.push(errorTable[`147${language}`]);
    }
    return errors;
  };

  const save = () => {
    let errors = [];
    errors = validate();
    setError(() => errors);
  };

  return (
    <Segment>
      <EditModal
        active={modalOpen}
        onItemCancel={() => (setModalOpen(false), setModalProps())}
        documents={modalProps}
      />
      <div className="setting">
        <div className="flex-container">
          <h1>{messages['setting_prices_and_premium_services']}</h1>
          <AddPrice />
        </div>

        <Dropdown
          clearable="true"
          selection
          options={companyOptions}
          placeholder={messages['bukrs']}
          onClick={() => setAllDropdownActive(true)}
          onChange={(e, { value }) => onChange('companyOptions', value)}
        />

        <Dropdown
          clearable="true"
          selection
          options={activeDropdown ? countryOptions : []}
          placeholder={messages['country']}
          id="secondDropdown"
          onClick={() => setAllDropdownActive(true)}
          onChange={(e, { value }) => onChange('countries', value)}
        />
        <button
          className="ui blue inverted button"
          onClick={onClickButton}
          style={{ marginLeft: 30 }}
        >
          <i aria-hidden="true" className="search icon"></i>{' '}
          {messages['search']}
        </button>
        <OutputErrors errors={error} />
        <br></br>
        <br></br>
        <ReactTableWrapper
          data={serviceOptionPriceList}
          columns={[
            {
              Header: () => <div style={{ textAlign: 'center' }}>id</div>,
              accessor: 'id',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>{messages['bukrs']}</div>
              ),
              accessor: 'bukrs',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>
                  {messages['Task.StartDate']}
                </div>
              ),
              accessor: 'dateStart',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => <div style={{ textAlign: 'center' }}>FC</div>,
              accessor: 'fc',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => <div style={{ textAlign: 'center' }}>MC</div>,
              accessor: 'mc',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>{messages['office']}</div>
              ),
              accessor: 'office',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>{messages['master']}</div>
              ),
              accessor: 'master',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>
                  {messages['Operator']}
                </div>
              ),
              accessor: 'operator',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>
                  {messages['discount']}
                </div>
              ),
              accessor: 'discount',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>
                  {messages['totalAmount']}
                </div>
              ),
              accessor: 'total',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>{messages['country']}</div>
              ),
              accessor: 'countryId',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>{messages['waers']}</div>
              ),
              accessor: 'waersId',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>
                  {messages['typeOfService']}
                </div>
              ),
              accessor: 'serviceTypeId',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>{row.value}</div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>
                  {messages['typeOfAmount']}
                </div>
              ),
              accessor: 'premiumPriceTypeId',
              Cell: row => (
                <div style={{ textAlign: 'center' }}>
                  {row.value === 'Percentage' ? '%' : 'Number'}
                </div>
              ),
            },
            {
              Header: () => (
                <div style={{ textAlign: 'center' }}>{messages['toEdit']}</div>
              ),
              filterable: false,
              Cell: ({ row }) => (
                <div style={{ textAlign: 'center' }}>
                  <Button
                    inverted
                    color="blue"
                    icon
                    onClick={() => (setModalOpen(true), setModalProps(row))}
                  >
                    <Icon name="pencil" />
                  </Button>
                </div>
              ),
            },
          ]}
          defaultPageSize={15}
          pages={2}
          previousText={messages['Table.Previous']}
          nextText={messages['Table.Next']}
          showPagination={true}
          className="-striped -highlight"
          pageSizeOptions={[20, 30, 40]}
          loadingText={messages['Table.Next']}
          noDataText={messages['Table.NoData']}
          rowsText={messages['Table.Rows']}
          pageText={messages['Table.Page']}
          ofText={messages['Table.Of']}
        />
      </div>
    </Segment>
  );
};

const mapStateToProps = state => {
  return {
    data: state.serviceReducer.data,
    countryList: state.f4.countryList,
    companyOptions: state.userInfo.companyOptions,
    informations: state.serviceReducer.data,
  };
};

export default connect(mapStateToProps, {
  f4FetchCountryList,
  fetchSmsetpp,
})(injectIntl(Page));