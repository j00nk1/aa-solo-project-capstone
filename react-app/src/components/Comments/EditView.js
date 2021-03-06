import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faX,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentThunk, editCommentThunk } from "../../store/comments";
import { deleteBtn } from "../../functions";

function EditView({ props }) {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState("");
  const comment = props?.comment;
  const [editedComment, setEditedComment] = useState(comment.content);
  const userObj = useSelector(state => state?.users);
  const sessionUser = props?.sessionUser;

  // const CommentMapper = (comment, i) => {
  const editModeBtn = () => {
    setEditMode(() => !editMode);
  };

  const cancelEditMode = async e => {
    e.preventDefault();
    await setEditMode(() => false);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setErrors("");
    if (!editedComment.length || editedComment.length > 100) {
      setErrors(
        "Comment must be at least 1 character long and less than 100 characters long"
      );
      return;
    }

    await setEditMode(() => false);
    await dispatch(
      editCommentThunk({
        content: editedComment,
        id: comment.id,
        record_id: comment.record_id,
        user_id: sessionUser.id,
      })
    );
  };

  return (
    <div key={comment?.content + "userId"} className="comment_container">
      <div className="each_comments">
        <NavLink
          to={`/users/${userObj[comment?.user_id]?.id}`}
          className="user_profile_link"
        >
          {userObj[comment?.user_id]?.username}
        </NavLink>
        {!editMode ? (
          <>
            <p className="comment_content">{comment?.content}</p>
            {/* TODO: allow the record holder to delete the comments? */}
            {comment?.user_id === sessionUser?.id && (
              <div className="btn_container">
                <button
                  className="edit_btn"
                  value={comment?.id}
                  onClick={e => editModeBtn(e)}
                  title="Edit Comment"
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button
                  className="delete_btn"
                  onClick={() =>
                    deleteBtn(
                      comment.id,
                      "Are you sure you want to delete this comment?",
                      dispatch,
                      deleteCommentThunk
                    )
                  }
                  title="Delete Comment"
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <form onSubmit={e => handleSubmit(e)} className="edit_form">
              <input
                value={editedComment}
                onChange={e => setEditedComment(e.target.value)}
                className="comment_input"
              />
              <small className="errors">{errors.length > 0 && errors}</small>
            </form>
            <div className="btn_container">
              <button
                onClick={e => handleSubmit(e)}
                className="edit_btn"
                title="Submit Change"
              >
                <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
              </button>
              <button
                onClick={cancelEditMode}
                className="cancel_btn"
                title="Cancel Change"
              >
                <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EditView;
