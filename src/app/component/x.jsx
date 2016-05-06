import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

const {shape, string} = PropTypes;

class X extends Component {
    static PropTypes = {
        app: shape({title: string})
    }
    render(){
        return <div>
            <h1>xxxxx</h1>
        </div>
    }
}
export default X;