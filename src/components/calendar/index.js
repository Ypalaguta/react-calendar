import React, {Component} from 'react'
import Head from '../../components/calendar/Head'
import Week from '../../components/calendar/Week'
import {connect} from 'react-redux'
import {setData, loadData, clearData, calendarSelector} from "../../ducks/calendar"
import {RaisedButton} from 'material-ui'
import PropTypes from 'prop-types'
import './index.css'

const buttonStyle = {
    backgroundColor: '#949494',
    color: '#fff',
}
const divStyle = {
    marginRight: '10px'
}
const paddings = {
    paddingLeft: '20px',
    paddingRight: '20px'
}

class Calendar extends Component {
    componentWillMount() {
        this.props.loadData();
    }

    render() {
        console.log('Calendar render')
        const {weeks} = this.props
        let weekComponents = []
        for (let key in weeks) {
            weekComponents.push(<Week key={key}
                                      weekLabel={key} /*hours={weeks[key]}*/
                                      setWeeksData={this.setWeeksData}/>)
        }
        return (
            <div>
                <Head labels={[
                    '', 'ALL DAY',
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
                <div className='buttonsRow'>
                    <RaisedButton buttonStyle={buttonStyle} style={divStyle} onClick={this.clickClearButtonHandler}
                                  overlayStyle={paddings} disabled={this.canClear(weeks)}>Clear</RaisedButton>
                    <RaisedButton buttonStyle={buttonStyle} style={divStyle} overlayStyle={paddings}>Save
                        changes</RaisedButton>
                </div>
            </div>
        );
    }

    setWeeksData = (key, data) => {
        const {setData} = this.props
        setData({key, data})
    }

    canClear(weeks){
        for(let key in weeks){
            for(let i=0;i<24;i++)
                if(weeks[key][i]) return false
        }
        return true
    }
    clickClearButtonHandler = (el) => {
        const {clearData} = this.props
        clearData();
    }
}

Calendar.propTypes = {
    //from connect
    weeks: PropTypes.object.isRequired
};

export default connect((store) => ({
    weeks: calendarSelector(store)
}), {setData, loadData, clearData})(Calendar);
