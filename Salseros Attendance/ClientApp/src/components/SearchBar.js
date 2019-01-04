import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../store/Members';
//TODO: upgrade from react-bootstrap -> react-strap
import { FormControl, Button } from 'react-bootstrap';
import { Dropdown } from 'semantic-ui-react';
import Select from 'react-select';
import Creatable from 'react-select/lib/Creatable';
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

    //CreatableSelect
    handleCreatableSelectChange = (newValue: any, actionMeta: any) => {
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
      };
      handleCreatableSelectInputChange = (inputValue: any, actionMeta: any) => {
        console.group('Input Changed');
        console.log(inputValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
      }

	render() {
		var membersList = this.searchMember(this.state.searchString);
		var selectionOptions = this.props.members;

        return (
            <div>
                https://react.semantic-ui.com/modules/dropdown/#types-search-selection
                <Dropdown placeholder='Enter name' fluid search selection options={membersList} />
				<CreatableSelect options={membersList} />
                https://material-ui.com/demos/autocomplete/
                https://react-select.com/creatable



                <FormControl type="text" placeholder="Enter your name" className={this.props.className} value={this.state.searchString} onChange={this.handleChange} />
                <div>
                    <ul>
                        {membersList.map(member =>
                            <li key={member.memberID} >
                                <Button onClick={() => this.addMemberToAttendance(member)} >
                                    {member.firstName} {member.lastName}
                                </Button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
}

//TODO: change members -> search bar?
export default connect(
    state => state.members,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SearchBar);