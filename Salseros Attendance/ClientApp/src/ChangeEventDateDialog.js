import React, { Component } from 'react';
import { Container, Row, Col, InputGroup, Input, Form, FormGroup } from 'reactstrap';

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

        if (this === undefined) return; //TODO: better way to do this?

        var date = this.datePicker.current.value;

        var eventID = 0;
        //Find event ID based on date chosen.
        console.log(this.props.allEvents);
        var matchingEvents = this.props.allEvents.filter(event => event.date === date + "T00:00:00");
        console.log(matchingEvents);

        if (matchingEvents.length === 1) {
            eventID = matchingEvents[0].eventID;
            this.props.handleLoadEvent(eventID);

        } else if (matchingEvents.length === 0) {
            //Create new event TODO: use function from parent
            let event = {
                title: "Salsa Class",
                date: date
            };

            let messageBody = event;

            fetch(`api/Events/`,
                {
                    method: "POST",
                    body: JSON.stringify(messageBody),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        console.log(result);
                        //this.setState({ eventID: result.eventID, event: result })
                        eventID = result.eventID; //TODO: this is coupled to the outer code.
                        this.props.handleLoadEvent(eventID);
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        }
        else {
            //prompt for choice.
        }

    }

    render() {
        return (
            <div id="ChangeEventDateDialog" >
                <Container>
                    <Form onSubmit={this.handleSubmit}>
                        <Row form>
                            <Col>
                                <FormGroup>
                                    <InputGroup size="lg">
                                        <Input type="date" innerRef={this.datePicker} />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Input hidden type="submit" value="Submit" />
                    </Form>
                </Container>
            </div>
        )
    }
}