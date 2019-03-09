import React, { Component } from 'react';
import { Container, Row, Col, InputGroup, InputGroupAddon, Input, Form, FormGroup, Popover, PopoverHeader, PopoverBody, Collapse, Button, UncontrolledTooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown, faAngleDoubleUp } from '@fortawesome/free-solid-svg-icons';

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
            isExtraOptionsCollapseOpen: false,
        };

        this.firstNameTextBox = React.createRef();
        this.lastNameTextBox = React.createRef();
        this.studentNumberTextBox = React.createRef();
        this.collegeEmailTextBox = React.createRef();
        this.submitButton = React.createRef();

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleStudentIDChange = this.handleStudentIDChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleGenerateCollegeEmail = this.handleGenerateCollegeEmail.bind(this);
        this.generateCollegeEmailInputValidation = this.hasValidInputsForGenerateCollegeEmail.bind(this);
        this.generateCollegeEmail = this.generateCollegeEmail.bind(this);
        this.isCollegeEmailDisabled = this.isCollegeEmailDisabled.bind(this);
        this.focusInputElement = this.focusInputElement.bind(this);
    }

    focusInputElement() {
        if (this.props.firstName === null || this.props.firstName === undefined) {
            this.firstNameTextBox.current.focus();
        } else if (this.props.lastName === null || this.props.lastName === undefined) {
            this.setState({ isLastNamePopoverOpen: true });
            this.lastNameTextBox.current.focus();
        } else if (this.props.studentNumber === null) {
            this.setState({ isStudentIDPopoverOpen: true });

            this.studentNumberTextBox.current.focus();
        } else {
            this.collegeEmailTextBox.current.focus();
        }
    }

    componentDidMount() {
        setTimeout(() => {

            if (this.firstNameTextBox === null || this.firstNameTextBox.current === null) {
                //ERROR: By the end of the timeout, the modal has disappeared.
                //TODO: surely there's a better way to determine if this dialog no longer exists.
                return;
            }

            this.focusInputElement();
        }, 550);

        if (this.state.studentNumber !== null && this.state.studentNumber !== undefined && this.state.studentNumber !== ""
            && this.state.firstName !== "" && this.state.lastName !== "") {
            this.generateCollegeEmail();
        }
    }

    async handleStudentIDChange(event) {
        var onlyNumbers = new RegExp('^([0-9])*$');
        var value = event.target.value;
        if (value.length <= 7 && onlyNumbers.test(value)) {
            await this.handleInputChange(event);
        }

        this.generateCollegeEmail();
    }

    isCollegeEmailDisabled = () => {
        return !this.hasValidInputsForGenerateCollegeEmail(this.state);
    }

    hasValidInputsForGenerateCollegeEmail(state) {
        return state.studentNumber.length === 7 &&
            state.firstName !== "" &&
            state.lastName !== "";
    }

    generateCollegeEmail() {

        if (this.hasValidInputsForGenerateCollegeEmail(this.state)) {

            this.setState({
                collegeEmail: this.state.firstName[0] + this.state.lastName.replace(/\s+/g, '') + this.state.studentNumber.slice(-4) + "@conestogac.on.ca",
            });
        }


    }

    async handleLastNameChange(event) {
        await this.handleInputChange(event);

        this.generateCollegeEmail();
    }

    async handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;


        this.setState({
            [name]: value
        });
    }

    handleGenerateCollegeEmail() {
        if (this.state.firstName === "") {
            this.firstNameTextBox.current.focus();
        } else if (this.state.lastName === "") {
            this.lastNameTextBox.current.focus();
        } else if (this.state.studentNumber === "") {
            this.studentNumberTextBox.current.focus();
        } else {
            this.generateCollegeEmail();
        }

    }

    handleSubmit(event) {
        event.preventDefault();

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
                    <Form onSubmit={this.handleSubmit} >
                        <Row form>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="sm">
                                        <InputGroupAddon addonType="prepend">First Name:</InputGroupAddon>
                                        <Input name="firstName" placeholder="First Name" type="text" className="text-capitalize" innerRef={this.firstNameTextBox} value={this.state.firstName} onChange={this.handleLastNameChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="sm">
                                        <InputGroupAddon addonType="prepend">Last Name:</InputGroupAddon>
                                        <Input name="lastName" placeholder="Last Name" type="text" className="text-capitalize" innerRef={this.lastNameTextBox} value={this.state.lastName} onChange={this.handleLastNameChange} required />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="sm" className="pb-4"> {/* Bottom padding makes room for popover. */}
                                        <InputGroupAddon addonType="prepend">Student ID:</InputGroupAddon>
                                        <Input name="studentNumber" placeholder="Student ID" type="text" innerRef={this.studentNumberTextBox} value={this.state.studentNumber} onChange={this.handleStudentIDChange} required />
                                    </InputGroup>
                                    <Popover trigger="focus" placement="bottom" isOpen={this.state.isStudentIDPopoverOpen} target={this.studentNumberTextBox} toggle={() => { this.setState({ isStudentIDPopoverOpen: !this.state.isStudentIDPopoverOpen }) }}>
                                        {/* <PopoverHeader>
                                            Just one more thing...
                                        </PopoverHeader> */}
                                        <PopoverBody>
                                            Type your student ID and press enter.
                                    </PopoverBody>
                                    </Popover>
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="sm">
                                        <InputGroupAddon addonType="prepend">
                                            <UncontrolledTooltip target="btnCollegeEmail" trigger="hover focus" placement="auto" >Click to generate.</UncontrolledTooltip>
                                            <Button id="btnCollegeEmail" onClick={this.handleGenerateCollegeEmail}>College Email:</Button>
                                        </InputGroupAddon>
                                        <Input name="collegeEmail" placeholder="College Email" innerRef={this.collegeEmailTextBox} type="text" value={this.state.collegeEmail} onChange={this.handleInputChange} required disabled={this.isCollegeEmailDisabled()} />
                                        {/* <InputGroupAddon addonType="append">@conestogac.on.ca</InputGroupAddon> */}
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col>
                                <Button color="link text-secondary text-decoration-none" id="btnExtraOptionsToggle" onClick={() => { this.setState({ isExtraOptionsCollapseOpen: !this.state.isExtraOptionsCollapseOpen }); }}>
                                    {!this.state.isExtraOptionsCollapseOpen ? "More" : "Less"} <FontAwesomeIcon icon={!this.state.isExtraOptionsCollapseOpen ? faAngleDoubleDown : faAngleDoubleUp} size="xs" />
                                </Button>
                                <Collapse isOpen={this.state.isExtraOptionsCollapseOpen}>
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
                                </Collapse>
                            </Col>
                        </Row>


                        <Input type="submit" value="Add Member" innerRef={this.submitButton} hidden />
                    </Form>
                </Container>
            </div>
        );
    }
}