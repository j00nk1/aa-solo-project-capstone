import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addCommentThunk, getCommentsThunk } from "../../store/comments";
import EditView from "./EditView";
import "./Comments.css";

function Comments({ record_id }) {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState("");

  const commentObj = useSelector(state => state.comments);
  const sessionUser = useSelector(state => state.session.user);
  const commentList = Object.values(commentObj).filter(
    comment => comment.record_id === record_id
  );

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors("");
    if (!comment.length || comment.length > 100) {
      setErrors(
        "Comment must be at least 1 character long and less than 100 characters long"
      );
      return;
    }

    await dispatch(
      addCommentThunk({
        content: comment,
        record_id,
        user_id: sessionUser.id,
      })
    );
    setComment("");
    await dispatch(getCommentsThunk());
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="comment_form">
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ width: "100%" }}
          placeholder="Write a comment & hit enter to submit"
        />
        <small className="errors">{errors.length > 0 && errors}</small>
      </form>

      {commentList.length > 0 &&
        commentList.map((comment, i) => (
          <EditView
            props={{ comment, index: i, sessionUser }}
            key={comment?.content + "userId"}
          />
        ))}
    </>
  );
}

export default Comments;
