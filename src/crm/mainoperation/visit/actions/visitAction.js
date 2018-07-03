import axios from 'axios';
import {ROOT_URL} from '../../../../utils/constants';
import { handleError } from '../../../../general/notification/notification_action';
import { modifyLoader } from '../../../../general/loader/loader_action';
import browserHistory from '../../../../utils/history';

/**
 *
 */
export const CRM_VISIT_FETCH_ARCHIVE = 'CRM_VISIT_FETCH_ARCHIVE';
export const CRM_VISIT_CLEAR_STATE = 'CRM_VISIT_CLEAR_STATE';

export const CRM_VISIT_FETCH_SINGLE = 'CRM_VISIT_FETCH_SINGLE'
export const CRM_VISIT_DELETE = 'CRM_VISIT_DELETE'
export const CRM_VISIT_CREATE = 'CRM_VISIT_CREATE'
export const CRM_VISIT_UPDATE = 'CRM_VISIT_UPDATE'
export const CRM_VISIT_MODAL_TOGGLE = 'CRM_VISIT_MODAL_TOGGLE'
export const CRM_VISIT_SET_FOR_UPDATE = 'CRM_VISIT_SET_FOR_UPDATE'
export const CRM_VISIT_SET_FOR_CREATE = 'CRM_VISIT_SET_FOR_CREATE';



export function fetchArchive(){
    return function(dispatch){
        dispatch(modifyLoader(true))
        axios.get(`${ROOT_URL}/api/crm/visit/archive`, {
            headers: {
                authorization: localStorage.getItem('token')}
        }).then(({data}) => {
            dispatch(modifyLoader(false))
            dispatch({
                type: CRM_VISIT_FETCH_ARCHIVE,
                payload: data
            })

        }).catch((e) => {
            dispatch(modifyLoader(false))
            handleError(e,dispatch)
        })
    }
}

export function fetchSingleVisit(id){
    return function (dispatch) {
        dispatch(modifyLoader(true))
        axios.get(`${ROOT_URL}/api/crm/visit/` + id, {
            headers: {
                authorization: localStorage.getItem('token')}
        }).then(({data}) => {
            dispatch(modifyLoader(false))
            dispatch({
                type:CRM_VISIT_FETCH_SINGLE,
                payload:data
            })
        }).catch(function (e) {
            dispatch(modifyLoader(false))
            handleError(e,dispatch)
        })
    }
}

export function deleteVisit(id){
    return function (dispatch) {
        dispatch(modifyLoader(true))
        axios.delete(`${ROOT_URL}/api/crm/visit/` + id, {
            headers: {
                authorization: localStorage.getItem('token')}
        }).then(({data}) => {
            dispatch(modifyLoader(false))
            browserHistory.push('/crm/visit/archive')
        }).catch(function (e) {
            dispatch(modifyLoader(false))
            handleError(e,dispatch)
        })
    }
}

export function createVisit(o){
    return function(dispatch){
        dispatch(modifyLoader(true))

        axios.post(`${ROOT_URL}/api/crm/visit/`, o, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        }).then((response) => {
                dispatch(modifyLoader(false))
                dispatch(fetchArchive())

            }).catch((e) => {
            dispatch(modifyLoader(false))
            handleError(e,dispatch)
        })
    }
}

export function updateVisit(o,fromComponent){
    return function(dispatch){
        dispatch(modifyLoader(true))

        axios.put(`${ROOT_URL}/api/crm/visit/`, o, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        }).then(({data}) => {
            dispatch(modifyLoader(false))
            if(fromComponent === 'archive'){
                dispatch(fetchArchive())
            }else if(fromComponent === 'view'){
                dispatch(fetchSingleVisit(o.id))
            }

        }).catch((e) => {
            dispatch(modifyLoader(false))
            handleError(e,dispatch)
        })
    }
}

export function modalToggle(flag){
    return {
        type: CRM_VISIT_MODAL_TOGGLE,
        payload: flag
    }
}

export function setVisitForUpdate(visit){
    return {
        type: CRM_VISIT_SET_FOR_UPDATE,
        payload: visit
    }
}

export function blankForCreate(staffId){
    staffId = staffId || 0
    return function(dispatch){
        dispatch(modifyLoader(true))

        axios.get(`${ROOT_URL}/api/crm/visit/blank/` + staffId, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        }).then(({data}) => {
            dispatch(modifyLoader(false))
            dispatch({
                type: CRM_VISIT_SET_FOR_CREATE,
                payload: data
            })

        }).catch((e) => {
            dispatch(modifyLoader(false))
            handleError(e,dispatch)
        })
    }
}