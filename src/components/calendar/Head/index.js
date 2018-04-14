import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Head extends Component {
    render() {
        const {labels} = this.props
        return (
            <div className='gridLabels'>
                {labels.map((label, num) => (<div key={num} className='grid-label'>{label}</div>))}
            </div>
        );
    }
}

Head.propTypes = {
    //from props
    labels: PropTypes.array
};

export default Head;
