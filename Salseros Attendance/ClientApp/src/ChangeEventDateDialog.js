import React, { Component } from 'react';
import { Container, Row, Col, InputGroup, InputGroupAddon, InputGroupText, Input, Form, FormGroup, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

export default class ChangeEventDateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }

        this.datePicker = React.createRef();
    }

    componentDidMount() {
        
        var today = new Date();
        var month = (today.getMonth() + 1);
        if (month < 10) {
            month = "0" + month;
        }
        var day = today.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var date = today.getFullYear() + '-' + month + '-' + day;
        this.datePicker.current.value = date;

        this.focusInputElement();
    }

    focusInputElement() {
        this.datePicker.current.focus();
    }

    handleSubmit(event) {
        event.preventDefault();

        var date = this.datePicker.current.value;

        var eventID = 0;
        //Find event ID based on date chosen.
        console.log(this.props.allEvents);
        var matchingEvents = this.props.allEvents.filter(event => event.date === date+"T00:00:00");
        console.log(matchingEvents);

        if (matchingEvents.length === 1) {
            eventID = matchingEvents[0].eventID;
        } else {
            //prompt for choice.
        }

        this.props.handleLoadEvent(eventID);
    }

    render() {
        return (
            <div className="ChangeEventDateDialog" >
                <Form onSubmit={this.handleSubmit}>
                    <Row form>
                        <Col>
                            <FormGroup>
                                <InputGroup size="lg">
                                    <Input type="date" innerRef={this.datePicker}/>
                                </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}