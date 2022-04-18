import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentThunk } from "../../store/comments";

function EditView({ props }) {
  console.log("PROPS!!??", props);
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  // const currComment = useSelector(state => state.comment).filter()
  const comment = props?.comment;
  const userObj = useSelector(state => state?.users);
  const sessionUser = props?.sessionUser;

  // const CommentMapper = (comment, i) => {
  const editModeBtn = comment_id => {
    console.log(editMode, comment_id);
    setEditMode(() => !editMode);
    console.log(editMode);
  };

  // DELETE BUTTON FUNCTION
  const handleRemove = async (e, comment_id) => {
    e.preventDefault();
    await dispatch(deleteCommentThunk(comment_id));
  };

  const cancelEditMode = async e => {
    e.preventDefault();
    await setEditMode(() => false);
    console.log(editMode);
  };

  const returnEditView = comment => {
    return (
      <form>
        <input defaultValue={comment} />
        <button onClick={cancelEditMode}>cancel</button>
      </form>
    );
  };

  return (
    <div key={comment?.content + "userId"} className="comment_container">
      {!editMode ? (
        <div className="each_comments">
          <NavLink
            to={`/users/${userObj[comment?.user_id]?.id}`}
            className="user_profile_link"
          >
            {userObj[comment?.user_id]?.username}
          </NavLink>
          <p style={{ padding: "0.5rem 1rem " }}>{comment?.content}</p>
          {/* TODO: allow the record holder to delete the comments? */}
          {comment?.user_id === sessionUser?.id && (
            <div className="btn_container">
              <button
                className="edit_btn"
                value={comment?.id}
                onClick={e => editModeBtn(comment?.id)}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              <button
                className="delete_btn"
                onClick={e => handleRemove(e, comment.id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          )}
        </div>
      ) : (
        returnEditView(comment.content)
      )}
    </div>
  );
}

export default EditView;
