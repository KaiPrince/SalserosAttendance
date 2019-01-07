import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Members';
import { Container, Row, Col, Button, InputGroup, InputGroupAddon, InputGroupText, Input, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';



class SearchBar extends Component {
    state = { searchString: '' }
    componentWillMount() {
        // This method runs when the component is first added to the page

        this.props.requestMembers();
    }

    handleChange = (e) => {
        this.setState({ searchString: e.target.value });
    }

    searchMember(searchString) {
        var membersList = this.props.members;
        searchString = this.state.searchString.trim().toLowerCase();
        var resultsList = [];

        if (searchString.length > 0) {
            resultsList = membersList.filter(member => member.firstName.toLowerCase().match(searchString) || member.lastName.toLowerCase().match(searchString));
        }

        return resultsList;
    }

    addMemberToAttendance = (member) => {
        this.props.addMemberToAttendance(member);
    }

    handleChange = (newValue) => {
        //Add member to attendance list.
        console.log(newValue);

        this.addMemberToAttendance(this.state.eventID, newValue.id);

        this.setState({ SignInTextBoxValue: null });

    };

    addMemberToAttendance(eventID, memberID) {
        let messageBody = JSON.stringify({ EventID: eventID, MemberID: memberID });

        fetch(`http://localhost:3396/api/AttendanceRecords/attend`,
            {
                method: "POST",
                body: messageBody,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(
                (result) => {
                    this.loadAttendanceList();
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    handleCreate = (inputValue) => {
        let parsedInput = inputValue.split(" ");
        let parsedfirstname = parsedInput[0];
        let parsedlastname = parsedInput[1];


        //Create new member
        this.setState({ memberToAdd: { firstname: parsedfirstname, lastname: parsedlastname, studentID: null } });
        this.setState({ showAddMemberDialog: true });
    };

    render() {
        let membersList = this.state.membersList;
        let dropdownOptions = [];
        membersList.forEach(member => {
            dropdownOptions.push({ id: member.MemberID, value: member.studentID.toString(), label: member.firstname + " " + member.lastname })
        });

        return (
            <div>
                <CreatableSelect
                    id="SignInTextBox"
                    ref={this.SignInTextBox}
                    placeholder="Enter your name or student number..."
                    isClearable
                    onCreateOption={this.handleCreate}
                    onChange={this.handleChange}
                    options={dropdownOptions}
                    value={this.state.SignInTextBoxValue}
                />
            </div>
        );
    }
}

//TODO: change members -> search bar?
export default connect(
    state => state.members,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SearchBar);