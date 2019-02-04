import React, { Component } from 'react';
import AddMemberDialog from './AddMemberDialog';
import ChangeEventDateDialog from './ChangeEventDateDialog';
import CreatableSelect from 'react-select/lib/Creatable';
import { Container, Row, Col, Button, Input, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faUserEdit, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import banner from './images/Cover Logo_uncropped.jpg';


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

        if (!this.state.showAddMemberDialog && !this.state.showChangeEventDateModal) {
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
        let attendingMembers = [];
        this.state.attendanceList.forEach(memberID => {
            let matchingMember = this.state.membersList.find(member => member.memberID === memberID);
            if (matchingMember !== undefined && matchingMember !== null) {
                attendingMembers.push(matchingMember);
            }
        });
        return (
            <div id="SignInPage" className="">
                <Container fluid>
                    <Row>
                        <Col>
                            {/* <h1 className="display-4">Sign-in Page</h1> */}
                            <img src={banner} className="img-fluid rounded"/>
                            {/* {this.state.event !== null ? this.state.event.title : "Salseros Attendance"} */}
                        </Col>
                    </Row>
                    <Row className="py-4">
                        <Col>
                            <Button color="secondary" outline className="" onClick={() => {this.loadAllEvents(); this.ChangeEventDateModalToggle()}} >
                                <FontAwesomeIcon icon={faCalendarDay} />
                            </Button>
                        </Col>
                        <Col lg="8">

                            <CreatableSelect
                                id="SignInTextBox"
                                ref={this.SignInTextBox}
                                placeholder="Enter your name or student number..."
                                isClearable
                                onCreateOption={this.handleCreate}
                                onChange={this.handleChange}
                                options={dropdownOptions}
                                value={this.state.SignInTextBoxValue}
                                formatCreateLabel={(inputValue) => {return <p className="text-danger text-decoration-none my-auto">New Member? Click here.</p>}}
                            />

                            {/* <Col sm="2">
                                <Button color="primary" onClick={() => {this.handleCreate(this.SignInTextBox.value)}}>Create</Button>
                            </Col> */}
                            
                            
                        </Col>
                        <Col>
                        {/* There could be a streaks or high scores widget here */}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Student #</th>
                                        <th>College Email</th>
                                        <th>Contact Email</th>
                                        <th></th>
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
                                        <td>
                                            {/* <Button outline color="secondary" size="sm" >
                                                <FontAwesomeIcon icon={faUserEdit} fixedWidth />
                                            </Button> */}
                                            <Button outline color="secondary" size="sm" onClick={() => this.removeMemberFromAttendance(member.memberID)} >
                                                <FontAwesomeIcon icon={faTrashAlt} fixedWidth />
                                            </Button>
                                        </td>
                                    </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container>
                <div id="allModals" >
                    <Modal id="ChangeEventDateModal" isOpen={this.state.showChangeEventDateModal} toggle={this.ChangeEventDateModalToggle} onOpened={() => { }}>
                        <ModalHeader toggle={this.ChangeEventDateModalToggle}>Change Event</ModalHeader>
                        <ModalBody>
                            <ChangeEventDateDialog ref={this.changeEventDateDialogRef} handleLoadEvent={this.loadEventByID} allEvents={this.state.allEvents}/>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={(event) => this.changeEventDateDialogRef.current.handleSubmit(event)}>Done</Button>
                            <Button color="secondary" onClick={this.ChangeEventDateModalToggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal id="AddMemberModal" isOpen={this.state.showAddMemberDialog} toggle={this.toggle} onOpened={() => { this.addMemberDialogRef.current.focusInputElement() }}>
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
                
            </div>
        )
    }
}