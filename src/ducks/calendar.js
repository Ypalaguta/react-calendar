import {Record} from 'immutable'
import {getDataUrl, setDataUrl} from '../config'
import {all, take, put, call} from 'redux-saga/effects'
import {createSelector} from 'reselect'

const appName = 'calendarApp'

export const moduleName = 'calendar'

const prefix = `${appName}/${moduleName}`

export const DATA_LOAD = `${prefix}/DATA_LOAD`                 //load data
export const DATA_LOAD_REQUEST = `${prefix}/DATA_LOAD_REQUEST` //load data request
export const DATA_SET = `${prefix}/DATA_SET`                  //set local data
export const DATA_SAVE = `${prefix}/DATA_SAVE`                 //set local data
export const DATA_SAVE_REQUEST = `${prefix}/DATA_SAVE_REQUEST` //save data request
export const DATA_REVERT = `${prefix}/DATA_REVERT`            //set local data to default (data)
export const DATA_ERROR = `${prefix}/DATA_ERROR`

const defaultWeek = Record({
        mo: [],
        tu: [],
        we: [],
        th: [],
        fr: [],
        sa: [],
        su: []
})

const defaultStore = Record({
    data: new defaultWeek(),
    localData: new defaultWeek(),
    isLoading: false,
    isSaving: false,
    msg: null,
    error: null,
})

export default function reducer(store = new defaultStore(), action) {
    const {type, payload} = action
    switch (type) {
        case DATA_LOAD:
            return store
                .set('data', new defaultWeek(payload.data))
                .set('localData',new defaultWeek(payload.data))
                // .set('msg', payload.msg)
                .set('error', '')
        case DATA_SAVE:
            return store
                .set('error', '')
        // .set('msg', payload.msg)
        case DATA_SET:
            return store
                 .setIn(['localData', payload.key], payload.data)
        case DATA_REVERT:
            return store
                .set('localData', store.get('data'))
        case DATA_ERROR:
            return store
                .set('error', payload.error)
        default:
            return store
    }
}

export function loadData() {
    return {
        type: DATA_LOAD_REQUEST,
    }
}

export function saveData(data) {
    return {
        type: DATA_SAVE_REQUEST,
        payload: data
    }
}

export function setData(data) {
    return {
        type: DATA_SET,
        payload: data
    }
}

function fetchData(url) {
   return fetch(url)
        .then(data=>data.json())
        .then(data=>data)
}

function* getDataSaga() {
    while (true) {
        yield take(DATA_LOAD_REQUEST)
        try {
            const data = yield call(fetchData, getDataUrl)
            yield put({
                type: DATA_LOAD,
                payload: {data}
            })
        }
        catch (error){
            yield put({
                type: DATA_ERROR,
                error
            })
        }
    }
}

function* setDataSaga() {
    while (true) {
        const action = yield take(DATA_SAVE_REQUEST)
        const {payload} = action
        const params = {
            method: 'POST',
            body: JSON.stringify(payload.data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }
        try {
            const data = yield call(fetch, [setDataUrl, params])
            yield put({
                type: DATA_SAVE,
                payload: {data: data.json}
            })
        }
        catch (error){
            yield put({
                type: DATA_ERROR,
                error
            })
        }
    }
}

const stateSelector = state => state[moduleName]
const weekLabelSelector = (_, props) => props.weekLabel
export const hoursSelector = createSelector(stateSelector, weekLabelSelector,
    (state, key) => state.get('localData').get(key));
export const calendarSelector = createSelector(stateSelector,
    (state) => state.get('localData').toJS());


export function* saga () {
    yield all([
        getDataSaga(),
        setDataSaga()
    ])
}