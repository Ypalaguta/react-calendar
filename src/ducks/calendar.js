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
export const DATA_CLEAR = `${prefix}/DATA_CLEAR`            //set local data to default (data)
export const DATA_REVERT = `${prefix}/DATA_REVERT`            //set local data to default (data)
export const DATA_MOUSE_PRESSED = `${prefix}/DATA_MOUSE_PRESSED`            //set local data to default (data)
export const DATA_ERROR = `${prefix}/DATA_ERROR`

const defaultWeek = Record({
    mo: new Array(24).fill(false),
    tu: new Array(24).fill(false),
    we: new Array(24).fill(false),
    th: new Array(24).fill(false),
    fr: new Array(24).fill(false),
    sa: new Array(24).fill(false),
    su: new Array(24).fill(false)
})

const defaultStore = Record({
    data: new defaultWeek(),
    localData: new defaultWeek(),
    isLoading: false,
    isSaving: false,
    msg: null,
    error: null,
    isMousePressed: false,
})

export default function reducer(store = new defaultStore(), action) {
    const {type, payload} = action
    switch (type) {
        case DATA_LOAD:
            return store
                .set('data', new defaultWeek(payload.data))
                .set('localData', new defaultWeek(payload.data))
                // .set('msg', payload.msg)
                .set('error', '')
        case DATA_SAVE:
            return store
                .set('data', new defaultWeek(store.get('localData')))
                .set('error', '')
        // .set('msg', payload.msg)
        case DATA_SET:
            return store
                .setIn(['localData', payload.key], payload.data)
        case DATA_REVERT:
            return store
                .set('localData', store.get('data'))
        case DATA_MOUSE_PRESSED:
            return store
                .set('isMousePressed', payload.status)
        case DATA_CLEAR:
            return store
                .set('localData', new defaultWeek())
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

export function clearData() {
    return {
        type: DATA_CLEAR
    }
}
export function setMouseStatus(status) {
    return {
        type: DATA_MOUSE_PRESSED,
        payload: {status}
    }
}
function statusHelper (response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}
function fetchData(url) {
    return fetch(url)
        .then(statusHelper)
        .then(data => data.json())
        .catch(error => error)
        .then(data => data)
}

function* getDataSaga() {
    while (true) {
        yield take(DATA_LOAD_REQUEST)
        try {
            const data = yield call(fetchData, getDataUrl)
            yield put({
                type: DATA_LOAD,
                payload: {data:decodeTimeSchedule(data)}
            })
        }
        catch (error) {
            yield put({
                type: DATA_ERROR,
                error
            })
        }
    }
}

function fetchPostData(url, params) {
    return fetch(url, params)
        .then(statusHelper)
        .catch(error => error)
}

function* setDataSaga() {
    while (true) {
        const action = yield take(DATA_SAVE_REQUEST)
        const {payload} = action
        const params = {
            method: 'POST',
            body: JSON.stringify(encodeTimeSchedule(payload)),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }
        try {
            const postReq = yield call(fetchPostData, setDataUrl, params)
            yield put({
                type: DATA_SAVE,
            })
        }
        catch (error) {
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

export const datasEqualSelector = createSelector(stateSelector, (state) => {
    const localData = state.get('localData')
    const serverData = state.get('data')
    if(localData===serverData) return true
    const localDataJs = localData.toJS()
    const serverDataJs = serverData.toJS()
    for(let key in localDataJs) {
        for(let i=0;i<24;i++){
            if(localDataJs[key][i]!==serverDataJs[key][i]){
                return false
            }
        }
    }
    return true
});

/**
 *
 * @param scheduleArr / new defaultWeek() / immutable Range() type
 * @returns {Immutable.Map<string, any>}
 */
export function encodeTimeSchedule(scheduleArr) {
    let week = new defaultWeek(scheduleArr)
    let weekJs = week.toJS()
    for (let key in weekJs) {
        let resultArr = []
        let start = 0;
        let end = 0;
        for (let i = 0; i < 24; i++) {
            if(weekJs[key][i] && i!==23)
                end++
            else {
                if(i===23) end++
                if(start !== end)
                    resultArr.push({bt:(start*60), et:((end*60)-1)})
                end = i+1
                start = i+1
            }
        }
        week = week.set(key, resultArr)
    }
    return new defaultWeek(week)
}

/**
 *
 * @param scheduleObj object of schedule
 * @returns {Immutable.Map<string, any>}
 */
export function decodeTimeSchedule(scheduleObj) {
    let week = new defaultWeek()
    // 24 byte for all day flag
    for (let key in scheduleObj) {
        if (scheduleObj[key]) {
            let result = new Array(24).fill(false)
            result.ad = false
            scheduleObj[key].forEach(el => {
                for (let i = (el.bt / 60); i < ((el.et + 1) / 60); i++)
                    result[i] = true
            })
            result.ad = checkForAd(result)
            week = week.set(key, result)
        }
    }
    return new defaultWeek(week)
}

export function checkForAd(arr) {
    return arr.reduce((acc, el) => (acc && el))
}

export function* saga() {
    yield all([
        getDataSaga(),
        setDataSaga()
    ])
}