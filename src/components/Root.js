import React, {Component} from 'react';
import Head from '../components/calendar/Head'
import Week from '../components/calendar/Week'
import PropTypes from 'prop-types';
import './calendar/calendar.css'

class Root extends Component {
    render() {
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
                <Week weekLabel='MO'/>
            </div>
        );
    }
}


export default Root;
