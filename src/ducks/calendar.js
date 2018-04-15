import {Record} from 'immutable'
import {getDataUrl, setDataUrl} from '../config'
import {all, take, put, call, takeEvery} from 'redux-saga/effects'

const appName = 'calendarApp'

export const moduleName = 'calendar'
export const DATA_GET = 'DATA_GET'                  //get local data
export const DATA_LOAD = 'DATA_LOAD'                 //load data
export const DATA_LOAD_REQUEST = 'DATA_LOAD_REQUEST' //load data request
export const DATA_SET = 'DATA_SET'                  //set local data
export const DATA_SAVE = 'DATA_SAVE'                 //set local data
export const DATA_SAVE_REQUEST = 'DATA_SAVE_REQUEST' //save data request
export const DATA_REVERT = 'DATA_REVERT'            //set local data to default (data)
export const DATA_ERROR = 'DATA_ERROR'
export const TEST = 'TEST'

function defaultWeek (){
    return {
        MO: [],
        TU: [],
        WE: [],
        TH: [],
        FR: [],
        SA: [],
        SU: []
    }
}


const defaultStore = Record({
    data: defaultWeek(),
    localData: defaultWeek(),
    isLoading: 'sdfsdf',
    isSaving: false,
    msg: null,
    error: null,
})


export default function reducer(store = new defaultStore(), action) {
    const {type, payload} = action
    switch (type) {
        case DATA_LOAD:
            return store
                .set('data', payload.data)
                .set('localData', payload.data)
                // .set('msg', payload.msg)
                .set('error', '')
        case DATA_SAVE:
            return store
                // .set('msg', payload.msg)
                .set('error', '')
        case DATA_SET:
            return store
                .set('localData', {...payload})
        case DATA_REVERT:
            return store
                .set('localData', store.get('data'))
        case DATA_ERROR:
            return store
                .set('error', payload.error)
        case TEST:
            return store
                .set('isLoading', 'adasdasdasdasdasd')
        default:
            return store
    }
}

export function loadData() {
    return {
        type: DATA_LOAD_REQUEST,
    }
}

export function test() {
    return {
        type: TEST,
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

function* getDataSaga() {
    while (true) {
        const action = yield take(DATA_LOAD_REQUEST)
        const {payload} = action
        try {
            const data = yield call(fetch, getDataUrl)
            yield put({
                type: DATA_LOAD,
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

function* setDataSaga() {
    while (true) {
        const action = yield take(DATA_SAVE_REQUEST)
        const {payload} = action
        const params = {
            method: 'POST',
            body: JSON.stringify(payload.data)
        }
        try {
            const data = yield call(fetch, [getDataUrl, params])
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

export function parseLocalData(weeksRecord) {
    const weeksJs = weeksRecord.get('localData')
    let items = []
    for(let key in weeksJs)
        items.push(Object.assign({},{hours:weeksJs[key]},{week:key}))
    return items
}

export function unparseLocalData(weeksArray) {
    let items = {}
    weeksArray.forEach(el=>{items=Object.assign({},items,{[el.week]:el.hours})})
    return items
}

export function* saga () {
    yield all([
        getDataSaga(),
        setDataSaga()
    ])
}