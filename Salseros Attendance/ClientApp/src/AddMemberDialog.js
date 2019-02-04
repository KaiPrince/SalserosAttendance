import React, { Component } from 'react';
import { Container, Row, Col, InputGroup, InputGroupAddon, Input, Form, FormGroup, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class AddMemberDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: this.props.firstName === undefined || this.props.firstName === null ? "" : this.props.firstName.charAt(0).toUpperCase() + this.props.firstName.slice(1),
            lastName: this.props.lastName === undefined || this.props.lastName === null ? "" : this.props.lastName.charAt(0).toUpperCase() + this.props.lastName.slice(1),
            studentNumber: this.props.studentNumber === undefined || this.props.studentNumber === null ? "" : this.props.studentNumber,
            collegeEmail: "",
            contactEmail: "",
            phoneNumber: "",
            isLastNamePopoverOpen: false,
            isStudentIDPopoverOpen: false,
        };

        this.firstNameTextBox = React.createRef();
        this.lastNameTextBox = React.createRef();
        this.studentNumberTextBox = React.createRef();
        this.collegeEmailTextBox = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStudentIDChange = this.handleStudentIDChange.bind(this);
        this.focusInputElement = this.focusInputElement.bind(this);
    }

    focusInputElement() {
        if (this.props.firstName === null || this.props.firstName === undefined) {
            this.firstNameTextBox.current.focus();
        } else if (this.props.lastName === null || this.props.lastName === undefined) {
            this.setState({ isLastNamePopoverOpen: true });
            this.lastNameTextBox.current.focus();
        } else if (this.props.studentNumber === null) {
            setTimeout(() => {
                this.setState({ isStudentIDPopoverOpen: true });

            }, 200);
            this.studentNumberTextBox.current.focus();
        } else {
            this.collegeEmailTextBox.current.focus();
        }
    }

    componentDidMount() {
        this.focusInputElement();

        if (this.state.studentNumber !== null && this.state.studentNumber !== undefined && this.state.studentNumber !== ""
            && this.state.firstName !== "" && this.state.lastName !== "") {
            this.setState({
                collegeEmail: this.state.firstName[0] + this.state.lastName.replace(/\s+/g, '') + this.state.studentNumber.slice(-4) + "@conestogac.on.ca",
            });
        }
    }

    handleStudentIDChange(event) {
        this.handleInputChange(event);

        if (event.target.value.length === 7) {

            this.setState({
                collegeEmail: this.state.firstName[0] + this.state.lastName + event.target.value.substring(event.target.value.length - 4) + "@conestogac.on.ca",
            });
        }


    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        //Add member to list.
        if (this.state.lastName === null || this.state.lastName === undefined) {
            alert('Must enter a last name');
            return;
        }
        else if (this.state.studentNumber === null || this.state.studentNumber === undefined || this.state.studentNumber === 0) {
            alert('Must enter a studentNumber');
            return;
        }

        let member = {
            MemberID: 0,
            FirstName: this.state.firstName,
            LastName: this.state.lastName,
            StudentNumber: this.state.studentNumber,
            CollegeEmail: this.state.collegeEmail,
            ContactEmail: this.state.contactEmail,
            PhoneNumber: this.state.phoneNumber,
        };
        this.props.handleAddMember(member);

    }

    render() {

        return (
            <div id="AddMemberDialog">
                <Container>
                    <Form onSubmit={this.handleSubmit}>
                        <Row form>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="sm">
                                        <InputGroupAddon addonType="prepend">First Name:</InputGroupAddon>
                                        <Input name="firstName" placeholder="First Name" type="text" innerRef={this.firstNameTextBox} value={this.state.firstName} onChange={this.handleInputChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="sm">
                                        <InputGroupAddon addonType="prepend">Last Name:</InputGroupAddon>
                                        <Input name="lastName" placeholder="Last Name" innerRef={this.lastNameTextBox} type="text" value={this.state.lastName} onChange={this.handleInputChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="sm">
                                        <InputGroupAddon addonType="prepend">Student ID:</InputGroupAddon>
                                        <Input name="studentNumber" placeholder="Student ID" innerRef={this.studentNumberTextBox} type="text" value={this.state.studentNumber} onChange={this.handleStudentIDChange} onBlur={() => this.setState({ isStudentIDPopoverOpen: false })} required />
                                    </InputGroup>
                                    <Popover /* trigger="focus" */ placement="bottom" isOpen={this.state.isStudentIDPopoverOpen} target={this.studentNumberTextBox} toggle={() => { this.setState({ isStudentIDPopoverOpen: !this.state.isStudentIDPopoverOpen }) }}>
                                        <PopoverHeader>
                                            Just one more thing...
                                    </PopoverHeader>
                                        <PopoverBody>
                                            Type your student ID and press enter.
                                    </PopoverBody>
                                    </Popover>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="sm">
                                        <InputGroupAddon addonType="prepend">College Email:</InputGroupAddon>
                                        <Input name="collegeEmail" placeholder="College Email" innerRef={this.collegeEmailTextBox} type="text" value={this.state.collegeEmail} onChange={this.handleInputChange} required />
                                        <InputGroupAddon addonType="append">@conestogac.on.ca</InputGroupAddon>
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="sm">
                                        <InputGroupAddon addonType="prepend">Contact Email:</InputGroupAddon>
                                        <Input name="contactEmail" placeholder="Contact Email" type="text" value={this.state.contactEmail} onChange={this.handleInputChange} />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <InputGroup size="sm">
                                        <InputGroupAddon addonType="prepend">Phone Number:</InputGroupAddon>
                                        <Input name="phoneNumber" placeholder="Phone Number" type="text" value={this.state.phoneNumber} onChange={this.handleInputChange} />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>


                        <Input type="submit" value="Add Member" hidden />
                        {/* 
                    <Input type="button" value="popover" onClick={() => {this.setState({isLastNamePopoverOpen: true})}} /> 
                    */}
                    </Form>
                </Container>
            </div>
        );
    }
}