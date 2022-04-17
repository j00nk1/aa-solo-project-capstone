const GET_USERS = "users/GET";

const getUsers = users => {
  return {
    type: GET_USERS,
    users,
  };
};

export const getUsersThunk = () => async dispatch => {
  const res = await fetch(`/api/users/`);
  const data = await res.json();
  dispatch(getUsers(data));
  return data;
};

const initialState = {};

const userReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case GET_USERS:
      newState = {};
      action.users.users.forEach(user => (newState[user.id] = user));
      return newState;
    default:
      return state;
  }
};

export default userReducer;
