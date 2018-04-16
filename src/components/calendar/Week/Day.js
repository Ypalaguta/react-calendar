import React, {Component} from 'react'
import PropTypes from 'prop-types'

class MyComponent extends Component {
    render() {
        return (
            <div onMouseEnter={this.mouseEnterHandler} className={this.props.cellClass} onClick={this.clickCellHandler}></div>
        );
    }
    clickCellHandler = (el) => {
        console.log(this.props.cellMinute)
        const {setHoursForWeek} = this.props
        setHoursForWeek(this.props.cellMinute)
    }
    mouseEnterHandler = () => {
        const {isMousePressed} = this.props
        if(isMousePressed)
            this.clickCellHandler()
    }
}

MyComponent.propTypes = {
    //from props
    cellClass: PropTypes.string.isRequired,
    cellMinute: PropTypes.number.isRequired,
    setHoursForWeek: PropTypes.func.isRequired
};

export default MyComponent
