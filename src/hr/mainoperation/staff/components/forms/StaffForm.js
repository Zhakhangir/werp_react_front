import React from 'react';
import {Form, Input,Button} from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import moment from 'moment'
require('moment/locale/ru');

const genderOptions = [
    { key: 'male', text: 'Мужской', value: 'male' },
    { key: 'female', text: 'Женский', value: 'female' }
]

/**
 * Функция для рендеринга формы сотрудника
 */

export default function StaffForm(props){
    const {staff} = props

    return <Form>
        <div className='ui segments'>
            <div className='ui segment'>
                <h3>Основные данные</h3>
            </div>
            <div className='ui secondary segment'>
                <Form.Group widths='equal'>
                    <Form.Field
                        name="lastname"
                        onChange={props.handleChange}
                        value={staff.lastname || ''}
                        control={Input}
                        required label='Фамилия' placeholder='Фамилия' />

                    <Form.Field
                        name="firstname"
                        onChange={props.handleChange}
                        value={staff.firstname || ''}
                        control={Input}
                        required label='Имя' placeholder='Имя' />

                    <Form.Field
                        name="middlename"
                        onChange={props.handleChange}
                        value={staff.middlename || ''}
                        control={Input}
                        label='Отчество' placeholder='Отчество' />
                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field
                        name="iinBin"
                        onChange={props.handleChange}
                        value={staff.iinBin || ''}
                        control={Input} required label='ИИН' placeholder='ИИН' />

                    <Form.Field required>
                        <label>Дата рождения</label>
                        <DatePicker
                            autoComplete="off"
                            locale="ru"
                            placeholderText={'Дата рождения'}
                            showMonthDropdown showYearDropdown dropdownMode='select'
                            selected={staff.birthday?moment(staff.birthday):null}
                            dateFormat='DD.MM.YYYY'
                            onChange={(v) => props.handleDate('birthday', v)}
                        />
                    </Form.Field>
                    <Form.Select
                        required
                        name="gender"
                        value={staff.gender}
                        label='Пол'
                        options={genderOptions}
                        placeholder='Пол'
                        onChange={props.handleChange} />

                    <Form.Field>
                        <label>Scouted By</label>
                        <Button.Group>
                            <Button
                                onClick={() => props.onClickScoutBtn()}
                                content= {staff.tsStaffName && staff.tsStaffName.length > 0?staff.tsStaffName:'Не выбрано'}
                                icon='search'
                                labelPosition='left' />
                            <Button
                                onClick={props.removeScout}
                                icon='remove' />
                        </Button.Group>
                    </Form.Field>
                </Form.Group>
            </div>
        </div>

        <div className='ui segments'>
            <div className='ui segment'>
                <h3>Документы</h3>
            </div>
            <div className='ui secondary segment'>
                <Form.Group widths='equal'>
                    <Form.Field
                        name="passportId"
                        onChange={props.handleChange}
                        value={staff.passportId || ''}
                        control={Input}
                        required
                        label='Номер уд. личности'
                        placeholder='Номер уд. личности' />

                    <Form.Field
                        name="passportGivenBy"
                        onChange={props.handleChange}
                        value={staff.passportGivenBy || ''}
                        control={Input}
                        required label='Кем выдан' placeholder='Кем выдан' />

                    <Form.Field required>
                        <label>Дата выдачи</label>
                        <DatePicker
                            autoComplete="off"
                            locale="ru"
                            label=''
                            selected={staff.passportGivenDate?moment(staff.passportGivenDate):null}
                            placeholderText={'Дата выдачи'}
                            showMonthDropdown showYearDropdown dropdownMode='select'
                            onChange={(v) => props.handleDate('passportGivenDate', v)}
                            dateFormat='DD.MM.YYYY' />
                    </Form.Field>

                    <Form.Field required>
                        <label>Срок действия уд.</label>
                        <DatePicker
                            autoComplete="off"
                            locale="ru"
                            label=''
                            selected={staff.passportValidity?moment(staff.passportValidity):null}
                            placeholderText={'Срок действия уд.'}
                            showMonthDropdown showYearDropdown dropdownMode='select'
                            onChange={(v) => props.handleDate('passportValidity', v)}
                            dateFormat='DD.MM.YYYY' />
                    </Form.Field>
                </Form.Group>


                <Form.Group widths='equal'>
                    <Form.Field
                        name="passportId2"
                        onChange={props.handleChange}
                        value={staff.passportId2 || ''}
                        control={Input}
                        label='Номер паспорта' placeholder='Номер паспорта' />

                    <Form.Field
                        name="passportGivenBy2"
                        onChange={props.handleChange}
                        value={staff.passportGivenBy2 || ''}
                        control={Input} label='Кем выдан (паспорт)' placeholder='Кем выдан (паспорт)' />

                    <Form.Field>
                        <label>Дата выдачи(паспорт)</label>
                        <DatePicker
                            autoComplete="off"
                            locale="ru"
                            label=''
                            selected={staff.passportGivenDate2?moment(staff.passportGivenDate2):null}
                            placeholderText={'Дата выдачи'}
                            showMonthDropdown showYearDropdown dropdownMode='select'
                            onChange={(v) => props.handleDate('passportGivenDate2', v)}
                            dateFormat='DD.MM.YYYY' />
                    </Form.Field>

                    <Form.Field>
                        <label>Срок действия (паспорт)</label>
                        <DatePicker
                            autoComplete="off"
                            label=''
                            selected={staff.passportValidity2?moment(staff.passportValidity2):null}
                            placeholderText={'Срок действия (паспорт)'}
                            showMonthDropdown showYearDropdown dropdownMode='select'
                            onChange={(v) => props.handleDate('passportValidity2', v)}
                            dateFormat='DD.MM.YYYY' />
                    </Form.Field>

                </Form.Group>
            </div>
        </div>

        <div className='ui segments'>
            <div className='ui segment'>
                <h3>Контакты</h3>
            </div>
            <div className='ui secondary segment'>
                <Form.Group widths='equal'>
                    <Form.Field
                        name="mobile"
                        onChange={props.handleChange}
                        value={staff.mobile || ''}
                        control={Input}
                        required
                        label='Мобильный'
                        placeholder='Мобильный' />

                    <Form.Field
                        name="mobile1"
                        onChange={props.handleChange}
                        value={staff.mobile1 || ''}
                        control={Input}
                        label='Мобильный2'
                        placeholder='Мобильный2' />

                    <Form.Field
                        name="homephone"
                        onChange={props.handleChange}
                        value={staff.homephone || ''}
                        control={Input}
                        label='Домашний телефон'
                        placeholder='Домашний телефон' />

                    <Form.Field
                        name="workphone"
                        onChange={props.handleChange}
                        value={staff.workphone || ''}
                        control={Input}
                        label='Рабочий телефон'
                        placeholder='Рабочий телефон' />


                </Form.Group>

                <Form.Group widths='equal'>
                    <Form.Field
                        name="corpEmail"
                        onChange={props.handleChange}
                        value={staff.corpEmail || ''}
                        control={Input}
                        label='Корпоративный email'
                        placeholder='Корпоративный email' />

                    <Form.Field
                        name="email"
                        onChange={props.handleChange}
                        value={staff.email || ''}
                        control={Input}
                        label='Личный email'
                        placeholder='Личный email' />

                    <Form.Field
                        name="email2"
                        onChange={props.handleChange}
                        value={staff.email2 || ''}
                        control={Input}
                        label='Доп. email'
                        placeholder='Доп. email' />
                </Form.Group>
            </div>
        </div>
    </Form>
}