import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/AttendanceRecords';
import { Container, Row, Col, Button, InputGroup, InputGroupAddon, InputGroupText, Input, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CreatableSelect from 'react-select/lib/Creatable';
import AddMemberDialog from '../AddMemberDialog';
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

                                    <SearchBar />

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
                                        {this.state.attendanceList.map((member) => <tr key={member.MemberID}>
                                            <td>{member.firstname} {member.lastname}</td>
                                            <td>{member.studentID}</td>
                                            <td>{member.CollegeEmail}</td>
                                            <td>{member.ContactEmail}</td>
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
        );
    };
}



export default connect(
    state => state.attendance,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Attendance);
