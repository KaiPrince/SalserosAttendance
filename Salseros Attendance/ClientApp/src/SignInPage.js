import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AddMemberDialog from './AddMemberDialog';
import CreatableSelect from 'react-select/lib/Creatable';
import { Container, Row, Col, Button, InputGroup, InputGroupAddon, InputGroupText, Input, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


export default class SignInPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            membersList: [],
            attendanceList: [],
            showAddMemberDialog: false,
            memberToAdd: null,
            SignInTextBoxValue: null,
            eventID: 1,
            willAddNewMemberToAttendance: false,
        };

        this.SignInTextBox = React.createRef();
        this.addMemberDialogRef = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.addMember = this.addMember.bind(this);
        this.removeMemberFromAttendance = this.removeMemberFromAttendance.bind(this);
        this.loadAllMembers = this.loadAllMembers.bind(this);
        this.loadAttendanceList = this.loadAttendanceList.bind(this);
        this.toggle = this.toggle.bind(this);
        this.addMemberToAttendance = this.addMemberToAttendance.bind(this);
    }

    componentDidMount() {

        if (!this.state.showAddMemberDialog) {
            this.SignInTextBox.current.focus();
        }

        //Load all members
        this.loadAllMembers();


        //Load current attendance list
        this.loadAttendanceList();

    }

    loadAllMembers() {
        fetch(`api/members`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ membersList: result });

                    if (this.state.willAddNewMemberToAttendance) {
                        let allIDs = [];
                        this.state.membersList.forEach(member => {
                            allIDs.push(member.MemberID);
                        });
                        let newMemberID = Math.max(...allIDs);

                        this.addMemberToAttendance(this.state.eventID, newMemberID);
                    }

                },
                (error) => {
                    console.log(error);
                }
            );

            
    }

    loadAttendanceList() {
        var eventID = 1;
        fetch(`api/AttendanceRecords/`)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({ attendanceList: result });

                    this.setState({ willAddNewMemberToAttendance: false });
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    addMember(member) {
        //TODO: handle errors and recieve memberID to add to attendance
        let messageBody = JSON.stringify(member);

        fetch(`api/Members/add`,
            {
                method: "POST",
                body: messageBody,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({ willAddNewMemberToAttendance: true }, () => {
                        this.loadAllMembers();
                    });


                },
                (error) => {
                    console.log(error);
                }
            );

        this.setState({ showAddMemberDialog: false });
        this.SignInTextBox.current.focus();
    }

    removeMemberFromAttendance(MemberID) {
        //Remove member from attendance list.
        console.log(MemberID);

        let messageBody = JSON.stringify({ EventID: this.state.eventID, MemberID: MemberID });

        fetch(`api/AttendanceRecords/remove`,
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

    handleChange = (newValue) => {
        //Add member to attendance list.
        console.log(newValue);

        this.addMemberToAttendance(this.state.eventID, newValue.id);

        this.setState({ SignInTextBoxValue: null });

    };

    addMemberToAttendance(eventID, memberID) {
        let messageBody = JSON.stringify({ EventID: eventID, MemberID: memberID });

        fetch(`api/AttendanceRecords/attend` + memberID,
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
        let parsedfirstName = parsedInput[0];
        let parsedlastName = parsedInput[1];


        //Create new member
        this.setState({ memberToAdd: { firstName: parsedfirstName, lastName: parsedlastName, studentNumber: null } });
        this.setState({ showAddMemberDialog: true });
    };

    toggle() {
        this.setState({
            showAddMemberDialog: !this.state.showAddMemberDialog
        });
    }

    render() {
        let membersList = this.state.membersList;
        let dropdownOptions = [];
        membersList.forEach(member => {
            dropdownOptions.push({ id: member.MemberID, value: member.studentNumber.toString(), label: member.firstName + " " + member.lastName })
        });
        let attendingMembers = [];
        this.state.attendanceList.forEach(memberID => {
            attendingMembers.push(this.state.membersList.filter(member => member.memberID === memberID));
        })

        return (
            <div className="SignInPage">
                <Container fluid>
                    <Row>
                        <Col sm="2"></Col>
                        <Col lg="8">
                            <Row>

                                <h1 className="mx-auto">Salseros Attendance - Sign-in page</h1>

                            </Row>
                            <Row>

                                <Col>

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

                                </Col>

                            </Row>
                            <Row>
                                <Col md>
                                    <div className="AddMemberModal">
                                        <Modal isOpen={this.state.showAddMemberDialog} toggle={this.toggle} onOpened={() => { this.addMemberDialogRef.current.focusInputElement() }}>
                                            <ModalHeader toggle={this.toggle}>Add new member</ModalHeader>
                                            <ModalBody>
                                                <AddMemberDialog {...this.state.memberToAdd} ref={this.addMemberDialogRef} handleAddMember={this.addMember} />
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="primary" onClick={(event) => this.addMemberDialogRef.current.handleSubmit(event)}>Do Something</Button>
                                                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                            </ModalFooter>
                                        </Modal>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Student Number</th>
                                            <th>College Email</th>
                                            <th>Contact Email</th>
                                            <th>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(this.state.attendanceList.length === 0) && 
                                            <tr><td colSpan="5"><p className="mx-auto text-muted">No one's here yet...</p></td></tr>
                                        }
                                        {attendingMembers.map((member) => <tr key={member.memberID}>
                                            <td>{member.firstName} {member.lastName}</td>
                                            <td>{member.studentNumber}</td>
                                            <td>{member.collegeEmail}</td>
                                            <td>{member.contactEmail}</td>
                                            <td><Input type="button" value="Remove" onClick={() => this.removeMemberFromAttendance(member.MemberID)} /></td>
                                        </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Row>
                        </Col>
                        <Col sm="2"></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}