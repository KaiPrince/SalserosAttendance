import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AddMemberDialog from './AddMemberDialog';
import ChangeEventDateDialog from './ChangeEventDateDialog';
import CreatableSelect from 'react-select/lib/Creatable';
import { Container, Row, Col, Button, FormGroup, Label, InputGroup, InputGroupAddon, InputGroupText, Input, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


export default class SignInPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            membersList: [],
            attendanceList: [],
            showAddMemberDialog: false,
            showChangeEventDateModal: false,
            memberToAdd: null,
            SignInTextBoxValue: null,
            eventID: null,
            event: null,
            allEvents: null,
            willAddNewMemberToAttendance: false,
            willCreateNewEvent: false,
        };

        this.SignInTextBox = React.createRef();
        this.addMemberDialogRef = React.createRef();
        this.changeEventDateDialogRef = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this); //TODO: remove?
        this.handleCreate = this.handleCreate.bind(this);
        this.addMember = this.addMember.bind(this);
        this.removeMemberFromAttendance = this.removeMemberFromAttendance.bind(this);
        this.loadAllMembers = this.loadAllMembers.bind(this);
        this.loadAttendanceList = this.loadAttendanceList.bind(this);
        this.loadAllEvents = this.loadAllEvents.bind(this);
        this.loadEventByID = this.loadEventByID.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.toggle = this.toggle.bind(this);
        this.ChangeEventDateModalToggle = this.ChangeEventDateModalToggle.bind(this);
        this.addMemberToAttendance = this.addMemberToAttendance.bind(this);
    }

    componentDidMount() {

        if (!this.state.showAddMemberDialog) {
            this.SignInTextBox.current.focus();
        }

        //Load all members
        this.loadAllMembers();

        //Load today's event
        this.loadEventByID(this.state.eventID);

        //Load current attendance list
        this.loadAttendanceList(this.state.eventID);

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
                            allIDs.push(member.memberID);
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

    loadEventByID(eventID) {
        console.log("loading event for " + eventID);
        if (eventID === null || eventID === undefined || eventID === 0) {

            fetch(`api/Events/`)
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState({ eventID: result.eventID, event: result },
                            () => {
                                if (this.state.event === null) {
                                    //this.setState({willCreateNewEvent: true});
                                    var today = new Date();
                                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                                    this.createNewEvent("Salsa Class", date); //TODO: prompt for title
                                }
                            })
                        
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        } else {
            
            fetch(`api/Events/` + eventID)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({ eventID: result.eventID, event: result },
                        () => {
                            if (this.state.event === null) {
                                //TODO: Error message. Handle no event found.
                            }
                            this.loadAttendanceList(this.state.eventID); //TODO change functions to await async instead of calling this twice.
                        })
                    
                },
                (error) => {
                    console.log(error);
                }
            );
        }

        //TODO: this is handling the behaviour of ChangeEventDialog class. Need to decouple.
        this.setState({ showChangeEventDateModal: false });
        this.SignInTextBox.current.focus();
    }

    loadAllEvents() {
        fetch(`api/Events/all`)
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result);
                        this.setState({ allEvents: result },
                            () => {
                                if (this.state.allEvents === null) {
                                    //TODO: handle no events returned error.
                                }
                            })
                    },
                    (error) => {
                        console.log(error);
                    }
                );
    }

    createNewEvent(title, date) {
        let event = {
            title: "Salsa Class",
            date: date
        };

        let messageBody = event;

        fetch(`api/Events/`,
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
                    //this.setState({ eventID: result.eventID, event: result })
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    loadAttendanceList(eventID) {
        
        console.log("loading attendance for " + eventID);
        if (eventID === null || eventID === undefined || eventID === 0) {
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
        } else {
            fetch(`api/AttendanceRecords/` + eventID)
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

    addMemberToAttendance(eventID, memberID) {
        let messageBody = JSON.stringify({ EventID: eventID, MemberID: memberID, Time: new Date() });
        console.log(messageBody);

        fetch(`api/AttendanceRecords/AttendEvent`,
            {
                method: "POST",
                body: messageBody,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then(
                (result) => {
                    this.loadAttendanceList(this.state.eventID);
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    removeMemberFromAttendance(MemberID) {
        //Remove member from attendance list.

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
                    this.loadAttendanceList(this.state.eventID);
                },
                (error) => {
                    console.log(error);
                }
            );



    }

    handleInputChange = (inputValue, actionMeta) => {

    }

    handleChange = (newValue) => {
        if (newValue !== null && newValue !== undefined) {
            //Add member to attendance list.

            this.addMemberToAttendance(this.state.eventID, newValue.id);

            this.setState({ SignInTextBoxValue: null });
        }

    };


    handleCreate = (inputValue) => {
        if (inputValue !== null && inputValue !== undefined) {
            let parsedInput = inputValue.replace(/\s+/g, ' ').split(" ");
            let parsedfirstName = null;
            let parsedlastName = null;
            let parsedstudentID = null;

            //Match student number: ^[0-9]{7}$
            var studentIDPattern = new RegExp('^[0-9]{7}$');
            //Match First and last name \w+
            var namePattern = new RegExp('\\w+');

            parsedInput.forEach(token => {
                if (studentIDPattern.test(token)) {
                    parsedstudentID = token;
                } else if (parsedfirstName == null && namePattern.test(token)) {
                    parsedfirstName = token;
                } else if (namePattern.test(token)) {
                    if (parsedlastName === null) parsedlastName = "";
                    if (parsedlastName !== "") parsedlastName += " ";
                    parsedlastName += token.charAt(0).toUpperCase() + token.slice(1); //TODO: move this logic into the AddMemberDialog. (this is a workaround for when there are multiple words in the input string)
                }
            });

            //Create new member
            this.setState({ memberToAdd: { firstName: parsedfirstName, lastName: parsedlastName, studentNumber: parsedstudentID } });
            this.setState({ showAddMemberDialog: true });
        }
       




    };

    toggle() {
        this.setState({
            showAddMemberDialog: !this.state.showAddMemberDialog
        });
    }

    ChangeEventDateModalToggle() {
        this.setState({
            showChangeEventDateModal: !this.state.showChangeEventDateModal
        });
    }

    render() {
        let membersList = this.state.membersList;
        let dropdownOptions = [];
        membersList.forEach(member => {
            dropdownOptions.push({ id: member.memberID, value: member.studentNumber.toString(), label: member.firstName + " " + member.lastName })
        });
        //TODO: optimize.
        let attendingMembers = []; //this.state.membersList.filter(member => this.state.attendanceList.includes(member.memberID));
        this.state.attendanceList.forEach(memberID => attendingMembers.push(this.state.membersList.find(member => member.memberID == memberID)));

        return (
            <div className="SignInPage">
                <Container fluid>
                    <Row>
                        <Col sm="2">
                            <Button color="secondary" onClick={() => {this.loadAllEvents(); this.ChangeEventDateModalToggle()}} >Change Date</Button>
                                
                            <Row>
                                <div className="ChangeEventDateModal">
                                    <Modal isOpen={this.state.showChangeEventDateModal} toggle={this.ChangeEventDateModalToggle} onOpened={() => { }}>
                                        <ModalHeader toggle={this.ChangeEventDateModalToggle}>Change Event</ModalHeader>
                                        <ModalBody>
                                            <ChangeEventDateDialog ref={this.changeEventDateDialogRef} handleLoadEvent={this.loadEventByID} allEvents={this.state.allEvents}/>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={(event) => this.changeEventDateDialogRef.current.handleSubmit(event)}>Done</Button>
                                            <Button color="secondary" onClick={this.ChangeEventDateModalToggle}>Cancel</Button>
                                        </ModalFooter>
                                    </Modal>
                                </div>
                            </Row>
                        </Col>
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
                                        formatCreateLabel={(inputValue) => {return "New Member? Click here."}}
                                        onInputChange={this.handleInputChange} //TODO: Remove this and the create button?
                                    />

                                </Col>
                                {/* <Col sm="2">
                                    <Button color="primary" onClick={() => {this.handleCreate(this.SignInTextBox.value)}}>Create</Button>
                                </Col> */}

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
                                                <Button color="primary" onClick={(event) => this.addMemberDialogRef.current.handleSubmit(event)}>Done</Button>
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
                                            <td><Input type="button" value="Remove" onClick={() => this.removeMemberFromAttendance(member.memberID)} /></td>
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