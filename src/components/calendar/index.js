import React, {Component} from 'react'
import Head from '../../components/calendar/Head'
import Week from '../../components/calendar/Week'
import {connect} from 'react-redux'
import {moduleName, parseLocalData, unparseLocalData} from '../../ducks/calendar'
import {setData} from "../../ducks/calendar";

import './index.css'

import PropTypes from 'prop-types'

class Calendar extends Component {
    render() {
        const {weeks} = this.props
        let weekComponents = []
        for(let key in weeks)
            weekComponents.push(<Week key={key} weekLabel={key} hours={weeks[key]} setData={this.setWeeksData}/>)
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
                {weekComponents}
            </div>
        );
    }

    setWeeksData = (week) =>{
        const {setData, weeks} = this.props
        setData(weeks, week)
    }
}

Calendar.propTypes = {};

export default connect((store)=>({
    weeks: store[moduleName].get('localData').toJS()
}), {setData})(Calendar);
