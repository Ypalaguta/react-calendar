import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Head extends Component {
    render() {
        const {weekLabel} = this.props
        const hours = new Array(24).fill(1)
        return (
            <div className='gridWeek'>
                <div key='grid-label' className='grid-label'>{weekLabel}</div>
                <div key='grid-empty'  className='grid-empty'></div>
                {hours.map((el, num) => (<div key={num*60} className='grid-hour'></div>))}
            </div>
        );
    }
}

Head.propTypes = {
    //from props
    weekLabel: PropTypes.string
};

export default Head;
