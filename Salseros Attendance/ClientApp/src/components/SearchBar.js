import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Members';
//TODO: upgrade from react-bootstrap -> react-strap
import { FormControl } from 'react-bootstrap'


class SearchBar extends Component {

    //TODO: add function for action onChange

    render() {
        return (
                <div>
                <FormControl type="text" placeholder="Enter your name" className={this.props.className} /> 
                </div>
        );
    }
}

//TODO: change members -> search bar?
export default connect(
    state => state.members,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SearchBar);