import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/AttendanceRecords';
import SearchBar from './SearchBar';

class Attendance extends Component {
    componentWillMount() {
        // This method runs when the component is first added to the page
        
        //const startDateIndex = parseInt(this.props.match.params.startDateIndex, 10) || 0;
        this.props.requestAttendanceRecords();
    }

    componentWillReceiveProps(nextProps) {
        // This method runs when incoming props (e.g., route params) change
        
        //const startDateIndex = parseInt(nextProps.match.params.startDateIndex, 10) || 0;
        this.props.requestAttendanceRecords();
    }
    
    render() {
        return (
            <div>
                <h1>Salseros Atten-dance</h1>

                <SearchBar />
                {renderRecordsTable(this.props)}
            </div>
        );
    };
}

function renderRecordsTable(props) {
    //TODO: remove this and refactor
    var members = props.records.members;
    if (members === undefined) {
        members = props.records;
    }
    //TODO: Link this to members, add call to members action
    return (
        <table className='table'>
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Conestoga Email</th>
                </tr>
            </thead>
            <tbody>
                {members.map(member =>
                    <tr key={member.memberID}>
                        <td>{member.firstName}</td>
                        <td>{member.lastName}</td>
                        <td>{member.collegeEmail}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default connect(
    state => state.attendance,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Attendance);
