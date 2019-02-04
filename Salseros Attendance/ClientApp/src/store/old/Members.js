const requestMembersType = 'REQUEST_MEMBERS';
const receiveMembersType = 'RECEIVE_MEMBERS';
const addMemberToAttendanceType = 'ADDMEMBERTOATTENDANCE_MEMBERS';
const initialState = { members: [], isLoading: false, refreshAttendanceList: false };

export const actionCreators = {
    searchMembers: searchString => async (dispatch, getState) => {
        if (searchString === getState().members.MemberID) {
            // Don't issue a duplicate request (we already have or are loading the requested data)
            return;
        }

        //TODO: make this properly load multiple members
        
        
    },

    //Load Members
    requestMembers: () => async (dispatch, getState) => {
        dispatch({ type: requestMembersType });

        const url = `api/Members`;
        const response = await fetch(url);
        const members = await response.json();

        dispatch({ type: receiveMembersType, members });
    },

    //Add new member TODO

    //Add member to attendance list
    addMemberToAttendance: (member) => async (dispatch, getState) => {
        if (getState().attendance.records.includes(member)) {
            return; //TODO: change to use ID
        }
        
        const url = `api/Members/attendTodayEvent/` + member.memberID;
        const response = await fetch(url, {
            method: 'PUT', // or 'PUT'
            //body: JSON.stringify(memberID), // data can be `string` or {object}!
            headers: {
                'Content-Type': 'application/json'
            }
        });
        //TODO: check if response if OK

        dispatch({type: addMemberToAttendanceType})
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestMembersType) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === receiveMembersType) {
        return {
            ...state,
            members: action.members,
            isLoading: false,
            refreshAttendanceList: false,
        };
    }

    if (action.type === addMemberToAttendanceType) {
        return {
            ...state,
            refreshAttendanceList: true,
        };
    }
    return state;
};
