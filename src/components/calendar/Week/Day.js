import React, {Component} from 'react';
import PropTypes from 'prop-types';

class MyComponent extends Component {
    render() {
        return (
            <div className={this.props.cellClass} onClick={this.clickCellHandler}></div>
        );
    }
    clickCellHandler = (el) => {
        console.log(this.props.cellMinute);
        const {setHoursForWeek} = this.props
        setHoursForWeek(this.props.cellMinute)
    }
}

MyComponent.propTypes = {
    cellClass: PropTypes.string.isRequired,
    cellMinute: PropTypes.number.isRequired
};

export default MyComponent;
