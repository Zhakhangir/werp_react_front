

import React, { PureComponent } from 'react';
import {  Popup, Button, Table, Icon, Grid, Segment, Input, Checkbox, TextArea, Label  } from 'semantic-ui-react';
import {moneyFormat} from '../../../utils/helpers';
import moment from 'moment';
import DatePicker from "react-datepicker";
import { Link } from 'react-router-dom';
import "react-datepicker/dist/react-datepicker.css";
require('moment/locale/ru');


const PopupBkpfInfo = (waers,cpudt,awtyp,customer_id,payroll_id,invoice_id,log_doc,closed,awkey2,dmbtr,dmbtr_paid,wrbtr,wrbtr_paid) => (
    <Popup trigger={<span><Button icon labelPosition='left' primary size='small'>
                <Icon name='info' size='large' />Доп. инфо
            </Button></span>} flowing   on='click'>
        <Table  compact>
            <Table.Body>
                <Table.Row><Table.Cell>Отк./Зак.</Table.Cell><Table.Cell>{closed===1?'Закрыт':'Открыт'}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Время</Table.Cell><Table.Cell>
                    <DatePicker
                        className='date-auto-width'
                        autoComplete="off"
                        showMonthDropdown showYearDropdown dropdownMode="select" //timezone="UTC"
                        selected={cpudt?moment(cpudt):''} locale="ru" 
                        dateFormat="DD.MM.YYYY" readOnly={true} disabled={true}/> 
                
                </Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Тип</Table.Cell><Table.Cell>{awtyp}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Контрагент ID</Table.Cell><Table.Cell>{customer_id}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Накладная ID</Table.Cell><Table.Cell>{invoice_id}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Платежная ведомость ID</Table.Cell><Table.Cell>{payroll_id}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Док. лог.</Table.Cell><Table.Cell>{log_doc}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Ссылка на док 2</Table.Cell><Table.Cell>{awkey2}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Сумма ВВ</Table.Cell><Table.Cell>USD {moneyFormat(dmbtr)}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Оплачено ВВ</Table.Cell><Table.Cell>USD {moneyFormat(dmbtr_paid)}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Сумма В</Table.Cell><Table.Cell>{waers} {moneyFormat(wrbtr)}</Table.Cell></Table.Row>
                <Table.Row><Table.Cell>Оплачено В</Table.Cell><Table.Cell>{waers} {moneyFormat(wrbtr_paid)}</Table.Cell></Table.Row>
            </Table.Body>
        </Table>
    </Popup>
)  

class Fa03Header extends PureComponent{
    
    constructor(props){
        super(props);
        this.initializeBkpf = this.initializeBkpf.bind(this); 
    }
    initializeBkpf(){
        const bkpf =    
        {   
            bukrs:'', brnch:'', business_area:'', official:false, dep:'', waers:'', 
            kursf:'', zreg:'', blart:'', budat:'', bldat:'', bktxt:'', contract_number:'', 
            awkey:'', usnam:'', tcode:'',storno:'',docStorno:'',docOriginal:'',
            
            cpudt:'',awtyp:'',customer_id:'', payroll_id:'',invoice_id:'',log_doc:'',
            closed:'',awkey2:'',dmbtr:'',dmbtr_paid:'',wrbtr:'',wrbtr_paid:''
        };
        return {bkpf};
    }
    render(){
        
        if (!this.props.bkpf){
            return '';
        }
        const {bkpf} =  !this.props.bkpf
                        ?   this.initializeBkpf()
                        :   this.props;

        const customerName =  !this.props.customerName?'':this.props.customerName;
        const branchName =  !this.props.branchName?'':this.props.branchName;
        const userFIO =  !this.props.userFIO?'':this.props.userFIO;
        const baName =  !this.props.baName?'':this.props.baName;
        const depName =  !this.props.depName?'':this.props.depName;
        const companyOptions =  !this.props.companyOptions?'':this.props.companyOptions;

        const stornoOriginal =  !this.props.stornoOriginal?'':this.props.stornoOriginal;
        const stornoOriginalBelnr =  !this.props.stornoOriginalBelnr?'':this.props.stornoOriginalBelnr;
        const stornoOriginalGjahr =  !this.props.stornoOriginalGjahr?'':this.props.stornoOriginalGjahr;
        const stornoOriginalBukrs =  !this.props.stornoOriginalBukrs?'':this.props.stornoOriginalBukrs;

        let docName = "";
        if (stornoOriginal==="storno") docName = "Документ отмены";
        if (stornoOriginal==="original") docName = "Документ оригинал";

        
        let awkeyBelnr = "";
        let awkeyGjahr = "";
        if (bkpf.awkey && bkpf.awkey.toString().length===14){
            var str = bkpf.awkey.toString();
            awkeyBelnr = str.substring(0,10);
            awkeyGjahr = str.substring(10,14);
        }

        let backgroundColor=''
        if (bkpf.storno===1 || bkpf.blart==='ST'){
            backgroundColor = '#F54C4C';
        }

        
        let readOnlyValue=true;
        if (this.props.trans==="FA02")
        {
            readOnlyValue = false;
        }
        
        return(
            <Segment padded size="small"  style={{backgroundColor}}>                
                    <Label color="blue" ribbon>
                        Заголовок
                    </Label>                   
                    <Grid columns={3}  stackable>
                    <Grid.Row>
                        <Grid.Column mobile={16} tablet={16} computer={5}>
                            <Table collapsing className='borderLess'>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>                                            
                                            <Icon name='folder' /> Компания
                                        </Table.Cell>
                                        <Table.Cell>
                                        {(bkpf.bukrs!==undefined && companyOptions.filter(item=>item.value===bkpf.bukrs).map(item => {
                                            return <Input key = {item.key} value={item.text} readOnly={true} />
                                            }))
                                        }
                                        
                                        {bkpf.bukrs==="" && <Input  value={""} readOnly={true} />}

                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name='browser' />
                                            Филиал
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input value={branchName} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name='browser' />                            
                                            Бизнес сфера
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input value={baName} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            Sn номер
                                        </Table.Cell>
                                        <Table.Cell>                                        
                                            <Input value={!bkpf.contract_number?'':bkpf.contract_number} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            Контрагент
                                        </Table.Cell>
                                        <Table.Cell>                                            
                                            <Input value={customerName} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            Официально
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Checkbox checked={bkpf.official===1?true:false} readOnly={true} /> 
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                        </Table.Cell>
                                        <Table.Cell> 
                                            {PopupBkpfInfo(bkpf.waers,bkpf.cpudt,bkpf.awtyp,bkpf.customer_id,bkpf.payroll_id,bkpf.invoice_id,bkpf.log_doc,bkpf.closed,bkpf.awkey2,bkpf.dmbtr,bkpf.dmbtr_paid,bkpf.wrbtr,bkpf.wrbtr_paid)} 
                                        </Table.Cell>                
                                    </Table.Row>   
                                </Table.Body>                     
                            </Table>
                            
                                
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={5}>
                            <Table collapsing className='borderLess'>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>                                            
                                            <Icon name='browser' /> Отдел
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input value={depName} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name='dollar' />
                                            Валюта
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input value={bkpf.waers} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name='exchange' />                            
                                            Курс   
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input value={bkpf.kursf} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name='wordpress forms' />                           
                                            Рег. номер
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input value={!bkpf.zreg?'':bkpf.zreg} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            Код
                                        </Table.Cell>
                                        <Table.Cell>                                        
                                            <Input value={bkpf.tcode} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            Отменен
                                        </Table.Cell>
                                        <Table.Cell>                                            
                                            <Checkbox checked={bkpf.storno===1?true:false} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            {docName}
                                        </Table.Cell>
                                        <Table.Cell>
                                        {stornoOriginalBelnr &&                                        
                                            <Link target="_blank" to={`/finance/mainoperation/fa03?belnr=`+stornoOriginalBelnr+`&bukrs=`+bkpf.bukrs+`&gjahr=`+stornoOriginalGjahr}>
                                                {stornoOriginalBelnr} {stornoOriginalGjahr}
                                            </Link>
                                        }                                        
                                            
                                        </Table.Cell>                
                                    </Table.Row>      
                                </Table.Body>                     
                            </Table>
                            
                                
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={16} computer={5}>
                        <Table collapsing className='borderLess'>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name='square outline' />
                                            Вид документа
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input value={bkpf.blart} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name='calendar' />    
                                            Дата проводки
                                        </Table.Cell>
                                        <Table.Cell>
                                            <DatePicker
                                              className='date-auto-width'
                                              autoComplete="off"
                                              showMonthDropdown showYearDropdown dropdownMode="select" //timezone="UTC"
                                              selected={bkpf.budat?moment(bkpf.budat):''} locale="ru" 
                                              dateFormat="DD.MM.YYYY" readOnly={true} disabled={true}/>
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            <Icon name='calendar' />                           
                                            Дата документа
                                        </Table.Cell>
                                        <Table.Cell>
                                            <DatePicker
                                              className='date-auto-width'
                                              autoComplete="off"
                                              showMonthDropdown showYearDropdown dropdownMode="select" //timezone="UTC"
                                              selected={bkpf.bldat?moment(bkpf.bldat):''} locale="ru" 
                                              dateFormat="DD.MM.YYYY" readOnly={true} disabled={true}/> 
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            Ссылка на документ
                                        </Table.Cell>
                                        <Table.Cell>
                                            
                                        {awkeyBelnr.length>0 &&                                        
                                            <Link target="_blank" to={`/finance/mainoperation/fa03?belnr=`+awkeyBelnr+`&bukrs=`+bkpf.bukrs+`&gjahr=`+awkeyGjahr}>
                                                {bkpf.awkey}
                                            </Link>
                                        }
                                        </Table.Cell>                
                                    </Table.Row>
                                    
                                    <Table.Row>
                                        <Table.Cell>
                                            Пользователь
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Input value={userFIO} readOnly={true} />
                                        </Table.Cell>                
                                    </Table.Row>                                
                                    
                                    <Table.Row>                                        
                                        <Table.Cell>
                                            <Icon name='comments outline' />
                                            Примечание
                                        </Table.Cell>
                                        
                                        <Table.Cell>
                                            <TextArea style={{ maxHeight: 45,minHeight: 45, minWidth:180, maxWidth:180 }}
                                                value={!bkpf.bktxt?'':bkpf.bktxt} maxLength='255' readOnly={readOnlyValue}
                                                onChange={(e, { value }) => this.props.onInputChangeData(value,'bktxt','')} 
                                            />
                                        </Table.Cell>                
                                    </Table.Row>
                                </Table.Body>                     
                            </Table>
                            
                            
                                
                        </Grid.Column>
                    </Grid.Row>
                    
                </Grid>           
                </Segment>
        )
    }

}


export default (Fa03Header)