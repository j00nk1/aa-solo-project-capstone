import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addCommentThunk, getRecordCommentsThunk } from "../../store/comments";

function Comments({ record_id }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState("");
  const commentObj = useSelector(state => state.comments);
  const sessionUser = useSelector(state => state.session.user);
  const commentList = Object.values(commentObj).filter(
    comment => comment.record_id === record_id
  );
  const userObj = useSelector(state => state.users);

  const user_profile = async user_id => {
    history.push(`/users/${user_id}`);
  };

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
    await dispatch(getRecordCommentsThunk(record_id));
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ width: "100%" }}
          placeholder="Write a comment & hit enter to submit"
        />
        <small className="errors">{errors.length > 0 && errors}</small>
      </form>
      {/* TODO: render comments */}

      {commentList.length > 0 &&
        commentList.map(comment => (
          <ul key={comment.content + "userId"}>
            <li onClick={() => user_profile(userObj[comment.user_id]?.id)}>
              {userObj[comment.user_id]?.username}
            </li>
            <li>{comment.content}</li>
          </ul>
        ))}
    </>
  );
}

export default Comments;
