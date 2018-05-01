import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { Tab,Header,Container,Icon,Segment,Label,Divider } from 'semantic-ui-react'
import moment from 'moment';
import { connect } from 'react-redux'
import {MENU_DASHBOARD} from '../wspaceUtil'
import '../css/main-page.css'
import {fetchGroupDealers} from '../../demo/actions/demoAction'
import WspaceHeader from './WspaceHeader'
import WspaceMenu from './WspaceMenu'
import WspaceContent from  './WspaceContent'
import WspaceDashboard from './WspaceDashboard'

const ITEMS = {
    all: [
        {
            id:1,
            clientName: 'Testov test',
            recommenderName: 'Бауыржан Иманкулов',
            phones: [
                '7052242645',
                '705 224 26 45'
            ]
        },
        {
            id:2,
            clientName: 'Асан',
            recommenderName: 'Айнаш',
            phones: [
                '7052242645',
                '705 224 26 45'
            ]
        },
        {
            id:3,
            clientName: 'Ольга',
            recommenderName: 'Димаш',
            phones: [
                '7052242645',
                '705 224 26 45'
            ]
        },
        {
            id:4,
            clientName: 'Асемгуль',
            recommenderName: 'Димаш',
            phones: [
                '7052242645',
                '705 224 26 45'
            ]
        },
        {
            id:5,
            clientName: 'Аягоз',
            recommenderName: 'Димаш',
            phones: [
                '7052242645',
                '705 224 26 45'
            ]
        },
        ,
        {
            id:6,
            clientName: 'Сабира',
            recommenderName: 'Димаш',
            phones: [
                '7052242645',
                '705 224 26 45'
            ]
        }
    ]
}

class WspaceMainPage extends Component {
  constructor (props) {
    super(props)
      this.state = {
        currentStaff:{},
        currentMenu: MENU_DASHBOARD
      }

      this.onSelectStaff = this.onSelectStaff.bind(this)
  }

  componentWillMount () {
      this.props.fetchGroupDealers()
  }

  onSelectStaff(staff){
      this.setState({
          ...this.state,
          currentStaff: staff
      })
  }

    onSelectMenu = (menu) => {
        this.setState({
            ...this.state,
            currentMenu: menu
        })
    }

  renderContent = () =>{
      switch (this.state.currentMenu){
          default:
              return <WspaceDashboard/>
      }
}

  render () {
      const {currentStaff} = this.state
    return (
      <Container fluid className={'main-container'}>
          <WspaceHeader
              dealers={this.props.dealers}
              currentId={currentStaff.value}
              onSelect={this.onSelectStaff}
          />
          <Divider horizontal>
              {currentStaff && currentStaff.text ?currentStaff.text:''}
          </Divider>
          <WspaceMenu
              activeItem={this.state.currentMenu}
              handleItemClick={this.onSelectMenu}/>
          <Divider horizontal>
              Действии на сегодня
          </Divider>
          {this.renderContent()}
      </Container>
    )
  }
}

function mapStateToProps (state) {
    return {
        dealers: state.crmDemo.dealers
    }
}

export default connect(mapStateToProps, {
    fetchGroupDealers
})(WspaceMainPage)
