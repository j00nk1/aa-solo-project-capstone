const GET_ALL_COMMENTS = "comments/all";
const ADD_COMMENT = "comment/add";
const EDIT_COMMENT = "comment/edit";
const DELETE_COMMENT = "comment/delete";

const getAllComments = comments => {
  return {
    type: GET_ALL_COMMENTS,
    comments,
  };
};

const addComment = comment => {
  return {
    type: ADD_COMMENT,
    comment,
  };
};

const editComment = comment => {
  return {
    type: EDIT_COMMENT,
    comment,
  };
};

const deleteComment = id => {
  return {
    type: DELETE_COMMENT,
    id,
  };
};

export const getCommentsThunk = () => async dispatch => {
  const res = await fetch(`/api/comments/`);
  const data = await res.json();
  dispatch(getAllComments(data));
  return data;
};

export const getRecordCommentsThunk = record_id => async dispatch => {
  const res = await fetch(`/api/comments/records/${record_id}/`);
  const data = await res.json();
  dispatch(getAllComments(data));
};

// fetch req to API routes in record_routes.py
export const addCommentThunk = comment => async dispatch => {
  const record_id = comment.record_id;
  const res = await fetch(`/api/records/${record_id}/comments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });

  const data = await res.json();
  dispatch(addComment(data));
  return data;
};

export const editCommentThunk = comment => async dispatch => {
  const comment_id = comment.id;
  const res = await fetch(`/api/comments/${comment_id}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });

  const data = await res.json();
  dispatch(editComment(data));
  return data;
};

export const deleteCommentThunk = id => async dispatch => {
  const res = await fetch(`/api/comments/${id}/`, {
    method: "DELETE",
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(deleteComment(id));
    return data;
  }
};

const initialState = {};

const commentReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case GET_ALL_COMMENTS:
      newState = {};
      action.comments.comments.forEach(
        comment => (newState[comment.id] = comment)
      );
      return newState;

    case ADD_COMMENT:
      newState[action.comment.id] = action.comment;
      return newState;

    case EDIT_COMMENT:
      newState[action.comment.id] = action.comment;
      return newState;

    case DELETE_COMMENT:
      delete newState[action.id];
      return newState;

    default:
      return state;
  }
};

export default commentReducer;
