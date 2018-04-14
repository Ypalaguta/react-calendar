import {saga as calendarSaga} from '../ducks/calendar'
import {all} from 'redux-saga/effects'

export default function* saga () {
    yield all([
        calendarSaga()
    ])
}