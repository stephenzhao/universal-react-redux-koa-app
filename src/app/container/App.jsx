import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router'

const {shape, string} = PropTypes;

class App extends Component {
    static PropTypes = {
        app: shape({title: string})
    }
    render(){
        return <div>
            <h1>1111</h1>
            <Link to='/x'>xxxxx</Link>
        </div>
    }
}
export default App;