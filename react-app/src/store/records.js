const GET_ALL_RECORDS = "records/all";
const ADD_RECORD = "record/add";
const EDIT_RECORD = "record/edit";
const DELETE_RECORD = "record/delete";

const getAllRecords = records => {
  return {
    type: GET_ALL_RECORDS,
    records,
  };
};

const addRecord = record => {
  return {
    type: ADD_RECORD,
    record,
  };
};

const editRecord = record => {
  return {
    type: EDIT_RECORD,
    record,
  };
};

const deleteRecord = id => {
  return {
    type: DELETE_RECORD,
    id,
  };
};

export const getRecordsThunk = () => async dispatch => {
  const res = await fetch(`/api/records/`);
  const data = await res.json();
  dispatch(getAllRecords(data));
  return data;
};

export const getUserRecordsThunk = user_id => async dispatch => {
  const res = await fetch(`/api/records/users/${user_id}/`);
  const data = await res.json();
  dispatch(getAllRecords(data));
};

export const getQuoteRecordsThunk = quote_id => async dispatch => {
  const res = await fetch(`/api/records/quotes/${quote_id}/`);
  const data = await res.json();
  dispatch(getAllRecords(data));
};

export const addRecordThunk = record => async dispatch => {
  const quote_id = record.quote_id;
  const res = await fetch(`/api/quotes/${quote_id}/records/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });

  const data = await res.json();
  dispatch(addRecord(data));
  return data;
};

export const editRecordThunk = record => async dispatch => {
  const record_id = record.id;
  const res = await fetch(`/api/records/${record_id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });

  const data = await res.json();
  dispatch(editRecord(data));
};

export const deleteRecordThunk = id => async dispatch => {
  const res = await fetch(`/api/records/${id}/`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(deleteRecord(id));
    return data;
  }
};

const initialState = {};

const recordReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case GET_ALL_RECORDS:
      newState = {};
      action.records.records.forEach(record => (newState[record.id] = record));
      return newState;

    case ADD_RECORD:
      newState[action.record.id] = action.record;
      return newState;

    case EDIT_RECORD:
      newState[action.record.id] = action.record;
      return newState;

    case DELETE_RECORD:
      delete newState[action.id];
      return newState;

    default:
      return state;
  }
};

export default recordReducer;
