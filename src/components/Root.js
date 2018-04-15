import React, {Component} from 'react';
import Calendar from './calendar'

class Root extends Component {
    render() {
        console.log('root render')
        return (
            <div>
                <h4>SET SCHEDULE</h4>
                <Calendar/>
            </div>
        );
    }
}


export default Root;
