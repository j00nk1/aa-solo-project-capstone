import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecordCommentsThunk } from "../../store/comments";

function Comments({ record_id }) {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const record_comments = useSelector(state => state.comments);

  useEffect(() => {
    dispatch(getRecordCommentsThunk(record_id));
  }, [dispatch, record_id]);

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(comment);
    // TODO: save comment
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ width: "100%" }}
          placeholder="Write a comment..."
        />
      </form>
      {/* TODO: render comments */}
    </>
  );
}

export default Comments;
