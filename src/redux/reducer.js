import {combineReducers} from 'redux'
import calendarReducer, {moduleName} from '../ducks/calendar'

export default combineReducers({
    [moduleName]: calendarReducer
})