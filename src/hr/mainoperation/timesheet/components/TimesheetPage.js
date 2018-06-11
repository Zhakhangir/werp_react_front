import React, {Component} from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import {Container,Divider,Header,Button,Segment,Form,Table,Message} from 'semantic-ui-react';
import YearF4 from '../../../../reference/f4/date/YearF4'
import MonthF4 from '../../../../reference/f4/date/MonthF4'
import {fetchItems,saveData,fetchStatuses} from '../actions/hrTimesheetAction'
import moment from 'moment'

const currentDate = new Date()
class TimesheetPage extends Component{

    constructor(props){
        super(props)
        this.state = {
            search:{
                bukrs: null,
                branchId: null,
                positionId: null,
                year: currentDate.getFullYear(),
                month: currentDate.getMonth()+1
            },
            selectedItems: {},
            leftPart: true,
            localItems: {}
        }

        this.renderData = this.renderData.bind(this)
    }

    componentWillMount(){
        this.loadItems()
        this.props.fetchStatuses()
    }

    handleChange = (e,data) => {
        let search = Object.assign({},this.state.search)
        let {name,value} = data
        search[name] = value

        this.setState({
            ...this.state,
            search: search
        })
    }

    loadItems = () => {
        this.setState({
            ...this.state,
            selectedItems: {}
        })
        this.props.fetchItems(this.state.search)
    }

    branchOptions = (bukrs) => {
        if(!bukrs){
            return []
        }
        let {branchOptionsAll} = this.props
        if(!branchOptionsAll || !branchOptionsAll[bukrs]){
            return []
        }

        return branchOptionsAll[bukrs] || []
    }

    saveData = () => {
        const {search,selectedItems}  =this.state
        let data = []

        for(let k in selectedItems){
            let temp = Object.assign({},selectedItems[k])
            temp['staffId'] = k
            temp['year'] = search['year']
            temp['month'] = search['month']

            let tempDays = []
            for(let t in temp['days']){
                tempDays.push(temp['days'][t])
            }

            temp['days'] = tempDays
            data.push(temp)
        }
        this.props.saveData(data)
    }

    renderActionButtons(){
        return <div>
            <Button.Group>
                <Button
                    color={'teal'}
                    onClick={() => this.setState({...this.state,leftPart:true})}
                    disabled={this.state.leftPart}
                    active={!this.state.leftPart}
                    icon='left chevron' />
                <Button
                    color={'teal'}
                    onClick={() => this.setState({...this.state,leftPart:false})}
                    disabled={!this.state.leftPart}
                    active={this.state.leftPart}
                    icon='right chevron' />
            </Button.Group>

            <Button onClick={this.saveData} primary floated={'right'}>Сохранить</Button>
            </div>
    }

    renderSearchForm () {
        let {companyOptions} = this.props
        const {search} = this.state
        if(!companyOptions){
            companyOptions = []
        }

        let selectedBukrs = search.bukrs
        if(companyOptions.length === 1){
            selectedBukrs = companyOptions[0]['value']
        }

        return <Form>
            <Form.Group widths='equal'>
                {companyOptions.length === 1?'':<Form.Select name='bukrs'
                             label='Компания' options={this.props.companyOptions}
                             placeholder='Компания' onChange={this.handleChange} />}

                <Form.Select
                    name='branchId'
                    search={true}
                    label='Филиал'
                    options={this.branchOptions(selectedBukrs)}
                    placeholder='Филиал'
                    onChange={this.handleChange} />

                <YearF4 value={search.year} handleChange={this.handleChange} />
                <MonthF4 value={search.month} handleChange={this.handleChange} />
            </Form.Group>
            <Form.Button onClick={this.loadItems}>Сформировать</Form.Button>
        </Form>
    }

    handleDayStatusChange = (item,dayNumber,value) => {
        const staffId = item.staffId
        let selectedItems = Object.assign({},this.state.selectedItems)
        if(!selectedItems[staffId]){
            selectedItems[staffId] = {
                bukrs: item.bukrs,
                branchId: item.branchId,
                departmentId: item.departmentId,
                positionId: item.positionId,
                days: {}
            }
        }

        selectedItems[staffId]['days'][dayNumber] = {number: dayNumber,statusName: value,enabled: true}

        this.setState({
            ...this.state,
            selectedItems: selectedItems
        })
    }

    itemStatusCount = (item, status) => {
        let days = item.days || []
        let filteredDays = _.filter(days,function(o){
            return o['status'] === status
        })

        return filteredDays.length
    }

    renderDaysCell = (item) => {
        let days = item.days || []
        let statuses = this.props.statuses
        if(!statuses){
            statuses = []
        }
        const {leftPart,selectedItems} = this.state
        let filteredDays = _.filter(days,function(o){
            if(leftPart){
                return o.number <= 15
            }else {
                return o.number > 15
            }
        })

        let staffSelectedItem = selectedItems[item.staffId] || {}
        let staffDays = staffSelectedItem['days'] || {}
        //let selectedItems[item.staffId + '_' + item.year + '_' + item.month]

    let content = filteredDays.map((day => {
                let opValue = staffDays[day.number]?staffDays[day.number]['statusName'] : (day['statusName']||'') //(day) @ToDo
                return <Table.Cell negative={opValue === 'MISSING'} positive={opValue === 'PRESENT'} key={day.number}>
                    <select value={opValue} onChange={(e) => this.handleDayStatusChange(item,day.number,e.target.value)}>
                        <option key={''} value={''}>-</option>
                        {statuses.map((s => {
                            return <option key={s.name} value={s.name}>{s.code}</option>
                        }))}
                    </select>
                </Table.Cell>
            }))

        return content
    }

    renderData(){
        let {items} = this.props
        const {year,month} = this.state.search
        const {leftPart} = this.state
        if(!items){
            items = []
        }

        let nextMonthDate = new Date(year, month, 0);
        let lastDay = parseInt(moment(nextMonthDate).format('DD'),10)
        let days = []
        if(leftPart){
            for(let day = 1; day <= 15; day++){
                days.push(day)
            }
        }else{
            for(let day = 16; day <= lastDay; day++){
                days.push(day)
            }
        }


        return <Container fluid style={{ marginTop: '2em', marginBottom: '2em', paddingLeft: '2em', paddingRight: '2em'}}>
            <Segment clearing>
                {this.renderActionButtons()}
            </Segment>
            <Divider clearing />
            <div style={{overflowX: 'scroll',fontSize:'12px'}}>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ФИО</Table.HeaderCell>
                        <Table.HeaderCell>Должность</Table.HeaderCell>
                        {days.map((day => {
                            return <Table.HeaderCell key={day}>{day}</Table.HeaderCell>
                        }))}
                        {/*<Table.HeaderCell>П.</Table.HeaderCell>*/}
                        {/*<Table.HeaderCell>Б.</Table.HeaderCell>*/}
                        {/*<Table.HeaderCell>О.</Table.HeaderCell>*/}
                        {/*<Table.HeaderCell>К.</Table.HeaderCell>*/}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {items.map((item => {
                        return <Table.Row key={item.staffId}>
                            <Table.Cell>{item.staffName}</Table.Cell>
                            <Table.Cell>{item.positionName}</Table.Cell>
                                {this.renderDaysCell(item)}
                            {/*<Table.Cell>{this.itemStatusCount(item,'PRESENT')}</Table.Cell>*/}
                            {/*<Table.Cell>{this.itemStatusCount(item,'ILL')}</Table.Cell>*/}
                            {/*<Table.Cell>{this.itemStatusCount(item,'MISSING')}</Table.Cell>*/}
                            {/*<Table.Cell>{this.itemStatusCount(item,'BUSINESS_TRIP')}</Table.Cell>*/}
                        </Table.Row>
                    }))}
                </Table.Body>

                <Table.Footer>
                    <Table.Row>
                    </Table.Row>
                </Table.Footer>
            </Table>
            </div>
            <Divider/>
        </Container>
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.items){
            // let update = true
            // let localItems = Object.assign([],this.state.localItems)
            // if(localItems && localItems.length > 0){
            //     console.log(localItems)
            //     let year = localItems[0]['year']
            //     let month = localItems[0]['month']
            //     for(let k in nextProps.items){
            //         if(nextProps.items[k]['year'] === year && nextProps.items[k]['month'] === month){
            //             update = false
            //             break
            //         }
            //     }
            // }
            //
            // if(update){
            //     this.setState({
            //         ...this.state,
            //         localItems: nextProps.items
            //     })
            // }
        }
    }

    renderStatusDescriptions(){
        let statuses = this.props.statuses
        if(!statuses){
            statuses = []
        }
        return <Message>
                    <Message.Header>Обозначения и коды</Message.Header>
                    <Message.List>
                        {statuses.map((status => {
                            return <Message.Item key={status.code}><strong>{status.code}</strong> - {status.description}</Message.Item>
                        }))}
                    </Message.List>
                </Message>
    }

    render () {
        return (
            <Container fluid style={{ marginTop: '2em', marginBottom: '2em', paddingLeft: '2em', paddingRight: '2em'}}>
                <Segment clearing>
                    <Header as='h3' attached='top'>Табель учета рабочего времени сотрудников</Header>
                    {this.renderSearchForm()}
                </Segment>
                <Divider clearing />
                {this.renderData()}
                <Divider/>
                {this.renderStatusDescriptions()}
            </Container>
        )
    }
}

function mapStateToProps (state) {
    return {
        companyOptions: state.userInfo.companyOptions,
        items: state.hrTimesheet.items,
        statuses: state.hrTimesheet.statuses,
        branchOptionsAll: state.userInfo.branchOptionsAll
    }
}

export default connect(mapStateToProps, {
    fetchItems,saveData,fetchStatuses
})(TimesheetPage)