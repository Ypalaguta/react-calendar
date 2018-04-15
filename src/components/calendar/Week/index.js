import React, {Component} from 'react'
import Day from './Day'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {hoursSelector} from '../../../ducks/calendar'

class Week extends Component {
    render() {
        console.log('Week render')

        const {weekLabel} = this.props
        const hourCells = new Array(24).fill(1)
        return (
            <div className='gridWeek'>
                <div key='grid-label' className='grid-label'>{weekLabel}</div>
                <div key='grid-empty' className='grid-empty'></div>
                {hourCells.map((el, num) => (<Day key={num * 60}
                                              cellClass={this.getClassNameForHour(num * 60)}
                                              cellMinute={num*60}
                                              setHoursForWeek={this.setHoursForWeek}
                />))}

            </div>
        );
    }

    checkForActivity(minute) {
        const {hours} = this.props
        let res = false
        if (hours) {
            hours.forEach((el) => {
                if (minute >= el.bt && minute < el.et){
                    res = true
                }
            })
        }
        return res
    }

    getClassNameForHour(minute) {
        return ('grid-hour' + (this.checkForActivity(minute)? ' active' : ''))
    }

    setHoursForWeek = (minute) =>{
        const {setWeeksData, weekLabel} = this.props
        const hours = this.addAndRefactorMinute(minute)
        setWeeksData(weekLabel, hours)
    }

    addAndRefactorMinute(minute){
        const {hours} = this.props
        let currentData = hours.map(el=>el)
        currentData.push({bt:minute, et:minute+60})
        return currentData
    }
}

Week.propTypes = {
    //from props
    weekLabel: PropTypes.string.isRequired,
    setWeeksData: PropTypes.func.isRequired,
    //from connect
    hours: PropTypes.array.isRequired,
};

export default connect((state, props) => ({
        hours: hoursSelector(state, props)
}))(Week)