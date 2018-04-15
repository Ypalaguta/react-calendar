import React, {Component} from 'react';
import Calendar from './calendar'
import PropTypes from 'prop-types';

class Root extends Component {
    render() {
        console.log('root render')
        return (
            <Calendar/>
        );
    }
}

Root.propTypes = {}

export default Root;
