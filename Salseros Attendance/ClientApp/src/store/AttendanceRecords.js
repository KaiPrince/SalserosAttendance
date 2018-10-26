const loadAttendanceRecordsType = 'REQUEST_ATTENDANCE_RECORDS';
const receiveAttendanceRecordsType = 'RECEIVE_ATTENDANCE_RECORDS';
//TODO: constants should follow naming convention
//TODO: change records -> record
const initialState = { records: [], isLoading: false };

export const actionCreators = {
    requestAttendanceRecords: () => async (dispatch, getState) => {
        if (0 !== getState().attendance.records.length) {
            //TODO: change this so it updates in real-time to changes in DB
            // Don't issue a duplicate request (we already have or are loading the requested data)
            return;
        }

        //Load Attendance (Member list)

        //Changes the state to "Loading".
        //TODO: rename this, cause it's not readable
        dispatch(loadAttendanceRecords());

        const url = `api/AttendanceRecords/`;
        const response = await fetch(url);
        const records = await response.json();

        //Changes the state to:
        // done loading,
        // updated records.
        dispatch(receiveAttendanceRecords(records));


    }
};

export const loadAttendanceRecords = () => ({
    type: loadAttendanceRecordsType
})

export const receiveAttendanceRecords = (records) => ({
    type: receiveAttendanceRecordsType,
    records
})

export const reducer = (state, action) => {
    state = state || initialState;

    //TODO change to switch
    if (action.type === loadAttendanceRecordsType) {
        return {
            ...state,
            isLoading: true
        };
    }

    if (action.type === receiveAttendanceRecordsType) {
        return {
            ...state,
            records: action.records,
            isLoading: false
        };
    }

    return state;
};
