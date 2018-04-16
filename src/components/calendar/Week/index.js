import React, {Component} from 'react'
import Day from './Day'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {hoursSelector, checkForAd} from '../../../ducks/calendar'

class Week extends Component {
    render() {
        console.log('Week render')
        const {weekLabel, hours} = this.props
        // console.log('------------',this.props,hours)
        return (
            <div className='gridWeek'>
                <div key='grid-label' className='grid-label'>{weekLabel}</div>
                <div key='grid-empty' className='grid-empty'></div>
                {hours.map((el, num) => (<Day key={num}
                                              cellClass={this.getClassNameForHour(num)}
                                              cellMinute={num}
                                              setHoursForWeek={this.setHoursForWeek}
                />))}

            </div>
        );
    }

    getClassNameForHour(num) {
        const {hours} = this.props
        return ('grid-hour' + (hours[num]? ' active' : ''))
    }

    setHoursForWeek = (num) =>{
        const {setWeeksData, weekLabel, hours} = this.props
        let result = hours.map((el, number)=>{return (number===num)?!el:el})
        result.ad = checkForAd(result)
        setWeeksData(weekLabel, result)
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
    hours: hoursSelector(state, props),
}))(Week)