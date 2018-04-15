import React, {Component} from 'react'
import Head from '../../components/calendar/Head'
import Week from '../../components/calendar/Week'
import {connect} from 'react-redux'
import {moduleName, parseLocalData, unparseLocalData} from '../../ducks/calendar'
import {DATA_SET, setData} from "../../ducks/calendar";

import './index.css'

import PropTypes from 'prop-types'

class Calendar extends Component {
    render() {
        const {weeks} = this.props
        return (
            <div>
                <Head labels={[
                    '','ALL DAY',
                    '00:00', '',
                    '03:00', '',
                    '06:00', '',
                    '09:00', '',
                    '12:00', '',
                    '15:00', '',
                    '18:00', '',
                    '21:00', '',
                ]}/>
                {weeks.map(el=>{return <Week key={el.week}
                                             weekLabel={el.week}
                                             hours={el.hours}
                                             setData={this.setWeeksData}/>})}
            </div>
        );
    }

    setWeeksData = (week, hours) =>{
        const {setData, weeks} = this.props
        const unparsedWeeks = unparseLocalData(weeks)
        setData(Object.assign({}, unparsedWeeks, {[week]:hours}))
    }
}

Calendar.propTypes = {};

export default connect((store)=>({
    weeks: parseLocalData(store[moduleName])
}), {setData})(Calendar);
