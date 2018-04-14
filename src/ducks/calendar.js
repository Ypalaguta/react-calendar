import {Record} from 'immutable'
import {getDataUrl, setDataUrl} from '../config'
import {all, take, put, call, takeEvery} from 'redux-saga/effects'

const appName = 'calendarApp'

export const moduleName = 'calendar'
export const DATA_GET = 'DATA_GET'
export const DATA_GET_REQUEST = 'DATA_GET_REQUEST'
export const DATA_SET = 'DATA_SET'
export const DATA_SET_REQUEST = 'DATA_SET_REQUEST'
export const DATA_ERROR = 'DATA_ERROR'

const defaultStore = Record({
    data: {
        mo: {},
        tu: {},
        we: {},
        th: {},
        fr: {},
        sa: {},
        su: {}
    },
    isLoading: false,
    isSaving: false,
    msg: null,
    error: null,
})

export default function reducer(store = new defaultStore(), action) {
    const {type, payload} = action
    switch (type) {
        case DATA_GET:
            return store
                .set('data', payload.data)
                // .set('msg', payload.msg)
                .set('error', '')
        case DATA_SET:
            return store
                // .set('msg', payload.msg)
                .set('error', '')
        case DATA_ERROR:
            return store
                .set('error', payload.error)
        default:
            return store
    }
}

export function getData() {
    return {
        type: DATA_GET_REQUEST,
    }
}

export function setData(data) {
    return {
        type: DATA_SET_REQUEST,
        payload: {data}
    }
}

function* getDataSaga() {
    while (true) {
        const action = yield take(DATA_GET_REQUEST)
        const {payload} = action
        try {
            const data = yield call(fetch, getDataUrl)
            yield put({
                type: DATA_GET,
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
        const action = yield take(DATA_SET_REQUEST)
        const {payload} = action
        const params = {
            method: 'POST',
            body: JSON.stringify(payload.data)
        }
        try {
            const data = yield call(fetch, [getDataUrl, params])
            yield put({
                type: DATA_SET,
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

export function* saga () {
    yield all([
        getDataSaga(),
        setDataSaga()
    ])
}