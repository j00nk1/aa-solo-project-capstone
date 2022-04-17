import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function Comments({ record_id }) {
  const history = useHistory();
  const [comment, setComment] = useState("");
  const commentObj = useSelector(state => state.comments);
  const commentList = Object.values(commentObj).filter(
    comment => comment.record_id === record_id
  );
  const userObj = useSelector(state => state.users);

  const user_profile = async user_id => {
    history.push(`/users/${user_id}`);
  };

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
          placeholder="Write a comment & hit enter to submit"
        />
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
