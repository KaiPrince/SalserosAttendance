const requestMembersType = 'REQUEST_MEMBERS';
const receiveMembersType = 'RECEIVE_MEMBERS';
const initialState = { members: [], isLoading: false };

export const actionCreators = {
    requestMembers: MemberID => async (dispatch, getState) => {
        if (MemberID === getState().members.MemberID) {
            // Don't issue a duplicate request (we already have or are loading the requested data)
            return;
        }

        //TODO: make this properly load multiple members
        //Load Members
        dispatch({ type: requestMembersType, MemberID });

        const url = `api/Members/GetToday`;
        const response = await fetch(url);
        const members = await response.json();

        dispatch({ type: receiveMembersType, MemberID, members });
        
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestMembersType) {
        return {
            ...state,
            MemberID: action.MemberID,
            isLoading: true
        };
    }

    if (action.type === receiveMembersType) {
        return {
            ...state,
            MemberID: action.MemberID,
            members: action.members,
            isLoading: false
        };
    }

    return state;
};
